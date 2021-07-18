import React, { Component } from 'react'
import propTypes from 'prop-types'
import { connect } from 'react-redux'
import Header from '../header/Header'
import MobileHeader from '../header/MobileHeader'
import { getParentFromUrl, withToast } from '../../../utils/helper'
import * as loginAction from '../../../redux/actions/loginAction'

class ConsumerLayout extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  componentDidMount() {
    const { userLoginInfo, fetchUserDetail } = this.props
    if (userLoginInfo.userLoginInfo.data.length === 0) {
      fetchUserDetail()
    }
  }

  render() {
    const { children, dashboard } = this.props
    let path = ''

    if (dashboard) {
      const { childrenProps } = this.props
      path = getParentFromUrl(childrenProps.location.pathname)
    } else {
      path = getParentFromUrl(children.props.location.pathname)
    }
    return (
      <div>
        <MobileHeader pathname={path} />
        <Header pathname={path} />
        {children}
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  userLoginInfo: state.userLoginInfo,
})

export default withToast(
  connect(mapStateToProps, { ...loginAction })(ConsumerLayout)
)

ConsumerLayout.propTypes = {
  childrenProps: propTypes.objectOf(propTypes.object).isRequired,
  userLoginInfo: propTypes.objectOf(propTypes.object).isRequired,
  dashboard: propTypes.objectOf(propTypes.object).isRequired,
  fetchUserDetail: propTypes.func.isRequired,
  children: propTypes.oneOfType([propTypes.func.isRequired, propTypes.object])
    .isRequired,
}
