import _ from 'lodash'
import React, { useState } from 'react'
import { Grid, Form, Input, Header, TextArea, Button } from 'semantic-ui-react'
import { useToasts } from 'react-toast-notifications'
import Subject from '../../../svgs/Subject'
import Message from '../../../svgs/Message'
import User from '../../../svgs/User'
import SimpleEmail from '../../../svgs/SimpleEmail'
import {
  invalidEmailForContactUs,
  invalidName,
  contactUsUpdateSuccess,
  emptyNameField,
  emptyMessageField,
} from '../../../utils/messages'
import { renderFieldError } from '../../../utils/helper'
import { nameRegex, emailRegex } from '../../../utils/constants'
import Loader from '../../../utils/Loader'
import UserService from '../../../api/services/UserService'
import * as placeholder from '../../../utils/placeholders'

const HelpAndSupport = () => {
  const { addToast } = useToasts()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)

  const validateField = (name, value) => {
    let error = errors
    if (error[name]) {
      error = _.omit(error, name)
    }

    if (name === 'name') {
      if (value.trim() === '') {
        error.name = [emptyNameField]
      } else if (!nameRegex.test(value)) {
        error.name = [invalidName]
      }
    }
    if (name === 'message') {
      if (value.trim() === '') {
        error.message = [emptyMessageField]
      }
    }

    if (name === 'email') {
      if (!emailRegex.test(value)) {
        error.email = [invalidEmailForContactUs]
      }
    }
    setErrors(error)
  }

  const areRequiredFilled = () => {
    const requiredFields = ['email', 'name', 'message']

    return requiredFields.find((i) => !eval(i)) === undefined
  }

  const handleFormOnChange = (e, { name, value }) => {
    if (name === 'email') setEmail(value)
    if (name === 'name') setName(value)
    if (name === 'message') setMessage(value)
    if (name === 'subject') setSubject(value)
    validateField(name, value)
  }

  const isFormValid = () => !Object.keys(errors).length

  const resetContactUsForm = () => {
    setName('')
    setEmail('')
    setSubject('')
    setMessage('')
  }

  const handleFormData = async () => {
    setIsLoading(true)
    try {
      const obj = {
        name: name.trim(),
        email: email.trim(),
        subject: subject.trim(),
        body: message.trim(),
      }
      const response = await UserService.contactUsService(obj)
      if (response.length) {
        addToast(response[0].message, { appearance: 'error' })
      } else {
        addToast(contactUsUpdateSuccess, { appearance: 'success' })
        resetContactUsForm()
      }
      setIsLoading(false)
    } catch (error) {
      addToast(error[0].message, { appearance: 'error' })
      console.warn('Contact us:', error)
      setIsLoading(false)
    }
  }

  return (
    <div className="help-support-tab">
      {isLoading && <Loader className="screen-centered" />}
      <Header as="h1">Contact Us</Header>
      <div className="text">
        <p>
          Please fill in your details and enquiry below. We will get back to you
          as soon as possible.
        </p>
      </div>

      <Form error={!isFormValid()} onSubmit={handleFormData}>
        <Grid columns={1}>
          <Grid.Column>
            <Form.Field>
              <Input
                iconPosition="left"
                placeholder={placeholder.name}
                name="name"
                value={name}
                error={!!errors.name}
                onChange={handleFormOnChange}
              >
                <User />
                <input />
              </Input>
              {renderFieldError([...(errors.name || [])])}
            </Form.Field>
          </Grid.Column>
          <Grid.Column>
            <Form.Field>
              <Input
                iconPosition="left"
                placeholder={placeholder.email}
                name="email"
                value={email}
                error={!!errors.email}
                onChange={handleFormOnChange}
              >
                <SimpleEmail />
                <input />
              </Input>
              {renderFieldError([...(errors.email || [])])}
            </Form.Field>
          </Grid.Column>
          <Grid.Column>
            <Form.Field>
              <Input
                iconPosition="left"
                name="subject"
                value={subject}
                error={!!errors.subject}
                placeholder={placeholder.subject}
                onChange={handleFormOnChange}
              >
                <Subject />
                <input />
              </Input>
            </Form.Field>
          </Grid.Column>
          <Grid.Column>
            <Form.Field>
              <div className="ui left icon input textarea">
                <Message />
                <TextArea
                  iconPosition="left"
                  name="message"
                  value={message}
                  error={!!errors.message}
                  placeholder={placeholder.message}
                  maxLength="250"
                  onChange={handleFormOnChange}
                />
              </div>
              {renderFieldError([...(errors.message || [])])}
            </Form.Field>
          </Grid.Column>
        </Grid>
        <Grid columns={1} className="form-button-wrapper">
          <Grid.Column>
            <Button
              type="submit"
              loading={isLoading}
              disabled={!isFormValid() || !areRequiredFilled()}
              primary
            >
              Send
            </Button>
          </Grid.Column>
        </Grid>
      </Form>
    </div>
  )
}

export default HelpAndSupport
