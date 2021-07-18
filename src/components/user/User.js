import React, { Component } from 'react'
import { ToastProvider } from 'react-toast-notifications'
import UserFunc from './UserFunc'

export default class User extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  render() {
    return (
      <div className="wrapper">
        <div className="sec1">This is user page</div>
        <ToastProvider>
          <UserFunc />
        </ToastProvider>
      </div>
    )
  }
}
