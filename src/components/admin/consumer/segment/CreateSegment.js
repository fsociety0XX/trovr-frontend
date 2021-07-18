import React, { useState } from 'react'
import _ from 'lodash'
import propTypes from 'prop-types'
import { Button, Modal, Form, Input, Grid, Select } from 'semantic-ui-react'
import { useHistory } from 'react-router-dom'
import Add from '../../../../svgs/Add'
import PieChart from '../../../../svgs/PieChart'
import { invalidSegmentName } from '../../../../utils/messages'
import { renderFieldError, withToast } from '../../../../utils/helper'
import SegmentService from '../../../../api/services/SegmentService'
import Loader from '../../../../utils/Loader'
import * as placeholder from '../../../../utils/placeholders'

const CreateSegment = (props) => {
  const history = useHistory()
  const [open, setOpen] = useState(false)
  const [segmentName, setName] = useState('')
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [segmentId, setSegmentId] = useState('')
  const { segment, consumerIds, segmentList } = props

  const segmentOptions = segmentList?.map((segmentData) => ({
    text: segmentData.name,
    value: segmentData.id,
    key: segmentData.id,
  }))

  const validateField = (name, value) => {
    let error = errors
    if (error[name]) {
      error = _.omit(error, name)
    }

    // segment name
    if (name === 'name') {
      if (value.length > 255) {
        error.name = [invalidSegmentName]
      }
    }
    setErrors(error)
  }

  const handleChange = (e, { name, value }) => {
    if (name === 'segmentName') {
      setName(value)
    }
    if (name === 'segmentId') {
      setSegmentId(value)
    }
    validateField(name, value)
  }
  const isFormValid = () => !Object.keys(errors).length
  const areRequiredFilled = () => {
    const requiredFields = []
    if (!segment) {
      requiredFields.push('segmentId')
    } else {
      requiredFields.push('segmentName')
    }
    return requiredFields.find((i) => !eval(i)) === undefined
  }
  const handleAddSegment = () => {
    const { addToast } = props

    if (!segment && Object.keys(consumerIds).length === 0) {
      addToast('Please select consumer', { appearance: 'error' })
    }
  }
  const handleCreateSegment = async (data) => {
    const { addToast, callSegmentListFunc } = props
    let response = null
    response = await SegmentService.createSegment(data)

    if (response.length > 0) {
      setOpen(false)
      setName('')
      setIsLoading(false)
      addToast(response[0].message, { appearance: 'error' })
    } else {
      setOpen(false)
      callSegmentListFunc()
      setName('')
      setIsLoading(false)
      addToast('segment created successfully', { appearance: 'success' })
    }
  }
  const handleEditSegment = async (data) => {
    const { addToast, callConsumerList } = props

    let response = null
    response = await SegmentService.editSegment(data, segmentId)

    if (response.length > 0) {
      setSegmentId('')
      setOpen(false)
      setIsLoading(false)
      addToast(response[0].message, { appearance: 'error' })
    } else {
      callConsumerList()
      history.push('/admin/consumer')
      setSegmentId('')
      setOpen(false)
      setIsLoading(false)
      addToast('segment assigned successfully', { appearance: 'success' })
    }
  }
  const handleFormData = () => {
    setOpen(false)
    setIsLoading(true)
    const obj = {}
    if (segment) {
      obj.name = segmentName.trim()
      handleCreateSegment(obj)
    } else {
      obj.consumerRoleIds = consumerIds
      handleEditSegment(obj)
    }
  }

  return (
    <>
      {isLoading && <Loader className="screen-centered" />}
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        onOpen={() =>
          setOpen(!(!segment && Object.keys(consumerIds).length === 0))
        }
        trigger={
          <Button primary icon onClick={() => handleAddSegment()}>
            <Add />
            {segment ? 'Create' : 'Assign'} Segment
          </Button>
        }
        className="create-segment-popup"
      >
        <Modal.Header className="a-center">
          {segment ? 'Create' : 'Assign'} Segment
        </Modal.Header>
        <Form error={!isFormValid()} onSubmit={handleFormData}>
          <Modal.Content>
            <Grid columns={1}>
              <Grid.Column>
                {segment ? (
                  <Form.Field>
                    <Input
                      iconPosition="left"
                      name="segmentName"
                      placeholder={placeholder.EnterSegmentName}
                      value={segmentName}
                      onChange={handleChange}
                    >
                      <PieChart />
                      <input />
                    </Input>
                    {renderFieldError([...(errors.name || [])])}
                  </Form.Field>
                ) : (
                  <Form.Field>
                    <div className="ui left icon select">
                      <PieChart />
                      <Select
                        placeholder={placeholder.segmentName}
                        options={segmentOptions}
                        name="segmentId"
                        onChange={handleChange}
                        value={segmentId}
                      />
                    </div>
                    {renderFieldError([...(errors.segment || [])])}
                  </Form.Field>
                )}
              </Grid.Column>
            </Grid>
          </Modal.Content>
          <Modal.Actions>
            <Button
              primary
              onClick={() => setOpen(true)}
              disabled={!isFormValid() || !areRequiredFilled()}
            >
              {segment ? 'Create' : 'Assign'}
            </Button>
            <Button secondary onClick={() => setOpen(false)}>
              Cancel
            </Button>
          </Modal.Actions>
        </Form>
      </Modal>
    </>
  )
}
export default withToast(CreateSegment)

CreateSegment.propTypes = {
  segment: propTypes.oneOfType([propTypes.func.isRequired, propTypes.object])
    .isRequired,
  consumerIds: propTypes.oneOfType([
    propTypes.func.isRequired,
    propTypes.object,
  ]).isRequired,
  addToast: propTypes.func.isRequired,
  callSegmentListFunc: propTypes.func.isRequired,
  segmentList: propTypes.objectOf(propTypes.object).isRequired,
  callConsumerList: propTypes.func.isRequired,
}
