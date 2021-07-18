import React, { Component } from 'react'
import { Header } from 'semantic-ui-react'
import propTypes from 'prop-types'
import StaticHeader from './Header'

export default class StaticLayout extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  render() {
    const { children } = this.props
    return (
      <>
        <StaticHeader />
        <div className="static-container">
          <Header as="h1">Terms &amp; Conditions</Header>
          {children}
        </div>
      </>
    )
  }
}

StaticLayout.propTypes = {
  children: propTypes.oneOfType([propTypes.func.isRequired, propTypes.object])
    .isRequired,
}
