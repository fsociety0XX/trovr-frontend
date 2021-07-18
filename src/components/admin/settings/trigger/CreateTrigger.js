import _ from 'lodash'
import React, { useState, useEffect } from 'react'
import { Header, Button, Form, Input, Select, Grid } from 'semantic-ui-react'
import propTypes from 'prop-types'
import dayjs from 'dayjs'
import { Link } from 'react-router-dom'
import Loader from '../../../../utils/Loader'
import PagiRightArrow from '../../../../svgs/PagiRightArrow'
import Trigger from '../../../../svgs/Trigger'
import TriggerType from '../../../../svgs/TriggerType'
import Hash from '../../../../svgs/Hash'
import 'react-semantic-ui-datepickers/dist/react-semantic-ui-datepickers.css'
import * as placeholder from '../../../../utils/placeholders'
import * as url from '../../../../utils/urls'
import { renderFieldError } from '../../../../utils/helper'
import { actionTypeOptions } from '../../../../utils/constants'
import {
  emptyTriggerName,
  emptyTag,
  invalidTag,
  emptyActionType,
  invalidTriggerName,
} from '../../../../utils/messages'

const CreateTrigger = (props) => {
  const {
    createTrigger,
    isLoading,
    triggerDetails,
    updateTrigger,
    emptyTriggerDetails,
  } = props
  const [errors, setErrors] = useState({})
  const [triggerName, setTriggerName] = useState('')
  const [actionType, setActionType] = useState('')
  const [tag, setTag] = useState('')
  const [editForm, setEditForm] = useState(false)
  const [triggerId, setTriggerId] = useState('')

  useEffect(() => {
    if (triggerDetails) {
      const { id, name, tag, action } = triggerDetails
      setEditForm(true)
      setTriggerName(name)
      setActionType(action)
      setTriggerId(id)
      setTag(tag)
    } else setEditForm(false)
  }, [triggerDetails])

  const areRequiredFilled = () => {
    const requiredFields = ['triggerName', 'actionType', 'tag']
    return requiredFields.find((i) => !eval(i)) === undefined
  }

  const validateField = (name, value) => {
    let error = errors
    if (error[name]) {
      error = _.omit(error, name)
    }

    if (name === 'triggerName') {
      if (value.trim() === '') {
        error.triggerName = [emptyTriggerName]
      } else if (value.trim().length < 3) {
        error.triggerName = [invalidTriggerName]
      }
    } else if (name === 'tag') {
      if (value.trim() === '') {
        error.tag = [emptyTag]
      } else if (value.trim().length < 3) {
        error.tag = [invalidTag]
      }
    } else if (name === 'actionType' && value.trim() === '') {
      error.actionType = [emptyActionType]
    }
    setErrors(error)
  }

  const handleChange = (event, { name, value }) => {
    name === 'triggerName' && setTriggerName(value)
    name === 'tag' && setTag(value)
    name === 'actionType' && setActionType(value)
    validateField(name, value)
  }

  const isFormValid = () => !Object.keys(errors).length

  const handleTriggerFormSubmit = () => {
    const obj = {
      name: triggerName.trim(),
      tag: tag.trim(),
    }
    !editForm && Object.assign(obj, { action: actionType })
    editForm ? updateTrigger(obj, triggerId) : createTrigger(obj)
  }

  return (
    <div className="create-voucher-page">
      {isLoading && <Loader className="screen-centered" />}
      <div className="page-header">
        <div className="page-left-header">
          <Header as="h1" className="breadcrumb-wrapper">
            <span>
              <Link to={url.trigger} onClick={() => emptyTriggerDetails()}>
                Triggers
              </Link>
            </span>{' '}
            <PagiRightArrow /> {`${editForm ? 'Update' : 'Create'}`} Trigger
          </Header>
          <div className="date">
            <span> {`${dayjs().format('dddd')}`}, </span>{' '}
            {`${dayjs().format('D MMMM YYYY')}`}
          </div>
        </div>
      </div>

      <Form error={!isFormValid()} onSubmit={handleTriggerFormSubmit}>
        <Grid columns="2">
          <Grid.Column>
            <Form.Field>
              <Input
                iconPosition="left"
                placeholder={placeholder.triggerName}
                name="triggerName"
                value={triggerName}
                onChange={handleChange}
              >
                <Trigger />
                <input />
              </Input>
              {renderFieldError([...(errors.triggerName || [])])}
            </Form.Field>
          </Grid.Column>

          <Grid.Column>
            <Form.Field>
              <div className="ui left icon select">
                <Select
                  placeholder={placeholder.triggerType}
                  options={actionTypeOptions}
                  name="actionType"
                  value={actionType}
                  onChange={handleChange}
                  disabled={editForm}
                />
                <TriggerType />
              </div>
              {renderFieldError([...(errors.actionType || [])])}
            </Form.Field>
          </Grid.Column>

          <Grid.Column>
            <Form.Field>
              <Input
                iconPosition="left"
                placeholder={placeholder.tag}
                name="tag"
                value={tag}
                onChange={handleChange}
                minLength={3}
                maxLength={25}
              >
                <Hash />
                <input />
              </Input>
              {renderFieldError([...(errors.tag || [])])}
            </Form.Field>
          </Grid.Column>
        </Grid>
        <Grid columns="2" className="form-button-wrapper">
          <Grid.Column>
            <Grid columns="2">
              <Grid.Column>
                <Button
                  primary
                  fluid
                  type="submit"
                  disabled={!isFormValid() || !areRequiredFilled()}
                >
                  {editForm ? 'Update' : 'Create'}
                </Button>
              </Grid.Column>
              <Grid.Column>
                <Link
                  to={url.trigger}
                  className="ui fluid secondary button"
                  onClick={() => emptyTriggerDetails()}
                >
                  Cancel
                </Link>
              </Grid.Column>
            </Grid>
          </Grid.Column>
        </Grid>
      </Form>
    </div>
  )
}

CreateTrigger.propTypes = {
  createTrigger: propTypes.func.isRequired,
  triggerDetails: propTypes.func.isRequired,
  updateTrigger: propTypes.func.isRequired,
  emptyTriggerDetails: propTypes.func.isRequired,
  isLoading: propTypes.bool.isRequired,
}

export default CreateTrigger
