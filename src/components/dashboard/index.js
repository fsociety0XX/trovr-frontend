import React, { Component } from 'react'
import ConsumerLayout from '../layout/consumer/ConsumerLayout'
import AdminLayout from '../layout/admin/AdminLayout'
import Dashboard from '../consumer/dashboard'
import AdminDashboard from '../admin/dashboard'

export default class index extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  render() {
    return localStorage.getItem('role') === 'consumer' ? (
      <ConsumerLayout childrenProps={this.props} dashboard>
        <Dashboard />
      </ConsumerLayout>
    ) : (
      <AdminLayout childrenProps={this.props} dashboard>
        <AdminDashboard />
      </AdminLayout>
    )
  }
}
