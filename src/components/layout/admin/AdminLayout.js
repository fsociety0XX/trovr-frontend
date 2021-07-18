import React, { Component } from 'react'
import propTypes from 'prop-types'
import { connect } from 'react-redux'
import Header from '../header/Header'
import MobileHeader from '../header/MobileHeader'
import Sidebar from './Sidebar'
import PagiLeftArrow from '../../../svgs/PagiLeftArrow'
import { getParentFromUrl, withToast } from '../../../utils/helper'
import * as loginAction from '../../../redux/actions/loginAction'

class AdminLayout extends Component {
  constructor(props) {
    super(props)
    this.state = {
      showSidebar: true,
    }
  }

  componentDidMount() {
    const { userLoginInfo, fetchUserDetail } = this.props
    if (userLoginInfo.userLoginInfo.data.length === 0) {
      fetchUserDetail()
    }
  }

  toggleSidebar = () => {
    const { showSidebar } = this.state
    this.setState({
      showSidebar: !showSidebar,
    })
  }

  render() {
    const { showSidebar } = this.state
    const { children, dashboard } = this.props
    let parentPath
    if (dashboard) {
      const { childrenProps } = this.props
      parentPath = getParentFromUrl(childrenProps.location.pathname)
    } else {
      parentPath = getParentFromUrl(children.props.location.pathname)
    }
    return (
      <div className={showSidebar ? '' : 'small-sidebar'}>
        <MobileHeader pathname={parentPath} />
        <Header pathname={parentPath} />
        <div className="admin-main-wrapper">
          <div
            className="sidebar-toggle-btn"
            onClick={this.toggleSidebar.bind(this)}
            onKeyDown={this.toggleSidebar.bind(this)}
          >
            <PagiLeftArrow />
          </div>
          <Sidebar parentPath={parentPath} />
          <div className="admin-main-container">{children}</div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  userLoginInfo: state.userLoginInfo,
})

export default withToast(
  connect(mapStateToProps, { ...loginAction })(AdminLayout)
)

AdminLayout.propTypes = {
  childrenProps: propTypes.objectOf(propTypes.object).isRequired,
  dashboard: propTypes.objectOf(propTypes.object).isRequired,
  userLoginInfo: propTypes.objectOf(propTypes.object).isRequired,
  fetchUserDetail: propTypes.func.isRequired,
  children: propTypes.oneOfType([propTypes.func.isRequired, propTypes.object])
    .isRequired,
}
