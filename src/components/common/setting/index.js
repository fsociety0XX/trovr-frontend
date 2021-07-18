import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Tab, Accordion, Icon } from 'semantic-ui-react'
import propTypes from 'prop-types'
import PersonalDetail from './PersonalDetail'
import BankDetail from './BankDetail'
import Notifications from './Notifications'
import ChangePassword from './ChangePassword'
import HelpAndSupport from './HelpAndSupport'
import Faq from '../../static/Faq'
import TermsAndCondition from '../../static/TermsAndCondition'
import * as loginAction from '../../../redux/actions/loginAction'
import UserService from '../../../api/services/UserService'
import { getParentFromUrl } from '../../../utils/helper'

const roles = ['systemAdmin', 'systemManager', 'systemUser']
class index extends Component {
  adminPanes = [
    {
      menuItem: 'Personal Details',
      render: () => {
        const { userLoginInfo, callUserAPI } = this.props
        const { userData, isLoading } = this.state
        return (
          <Tab.Pane attached={false}>
            <PersonalDetail
              userLoginInfo={userLoginInfo}
              isLoading={isLoading}
              userData={userData}
              callUserAPI={callUserAPI}
              fetchUserDetails={this.fetchUserDetails}
              res="desktop"
            />
          </Tab.Pane>
        )
      },
    },
    {
      menuItem: 'Notifications',
      render: () => (
        <Tab.Pane attached={false}>
          <Notifications />
        </Tab.Pane>
      ),
    },
    {
      menuItem: 'Change Password',
      render: () => {
        const { userData } = this.state
        return (
          <Tab.Pane attached={false}>
            <ChangePassword userData={userData} />
          </Tab.Pane>
        )
      },
    },
    {
      menuItem: 'FAQs',
      render: () => (
        <Tab.Pane attached={false}>
          <Faq />
        </Tab.Pane>
      ),
    },
    {
      menuItem: 'Terms & Conditions',
      render: () => (
        <Tab.Pane attached={false}>
          <TermsAndCondition />
        </Tab.Pane>
      ),
    },
  ]

  consumerPanes = [
    {
      menuItem: 'Personal Details',
      render: () => {
        const { userLoginInfo, callUserAPI } = this.props
        const { userData, isLoading } = this.state
        return (
          <Tab.Pane attached={false}>
            <PersonalDetail
              userLoginInfo={userLoginInfo}
              isLoading={isLoading}
              userData={userData}
              callUserAPI={callUserAPI}
              fetchUserDetails={this.fetchUserDetails}
              res="desktop"
            />
          </Tab.Pane>
        )
      },
    },
    {
      menuItem: 'Bank Details',
      render: () => (
        <Tab.Pane attached={false}>
          <BankDetail />
        </Tab.Pane>
      ),
    },
    {
      menuItem: 'Notifications',
      render: () => (
        <Tab.Pane attached={false}>
          <Notifications />
        </Tab.Pane>
      ),
    },
    {
      menuItem: 'Change Password',
      render: () => {
        const { userData } = this.state
        return (
          <Tab.Pane attached={false}>
            <ChangePassword userData={userData} />
          </Tab.Pane>
        )
      },
    },
    {
      menuItem: 'Help & Support',
      render: () => (
        <Tab.Pane attached={false}>
          <HelpAndSupport />
        </Tab.Pane>
      ),
    },
    {
      menuItem: 'FAQs',
      render: () => (
        <Tab.Pane attached={false}>
          <Faq />
        </Tab.Pane>
      ),
    },
    {
      menuItem: 'Terms & Conditions',
      render: () => (
        <Tab.Pane attached={false}>
          <TermsAndCondition />
        </Tab.Pane>
      ),
    },
  ]

  constructor(props) {
    super(props)
    this.state = {
      activeIndex: 0,
      userData: null,
      isLoading: false,
    }
  }

  componentDidMount() {
    this.setActiveIndex()
    this.fetchUserDetails()
  }

  componentDidUpdate(prevProps) {
    const { location } = this.props
    if (prevProps.location.pathname !== location.pathname) {
      this.setActiveIndex()
    }
  }

  setActiveIndex = () => {
    const { location } = this.props
    const path = getParentFromUrl(location.pathname)
    if (localStorage.getItem('role') === 'systemAdmin') {
      if (path.grandchildren === 'notifications') {
        this.setState({ activeIndex: 1 })
      }
    } else if (
      (localStorage.getItem('role') === 'systemUser' ||
        localStorage.getItem('role') === 'systemManager') &&
      path.grandchildren === 'notifications'
    ) {
      this.setState({ activeIndex: 2 })
    } else if (path.children === 'notifications') {
      this.setState({ activeIndex: 2 })
    } else {
      this.setState({ activeIndex: 0 })
    }
  }

  /**
   * @author Kushagra Garg
   * @description This API call will fetch details of currently logged in user
   */
  fetchUserDetails = async () => {
    this.setState({ isLoading: true })
    try {
      const userData = await UserService.fetchUserDetails()
      this.setState({
        userData,
        isLoading: false,
      })
    } catch (e) {
      console.warn('Consumer Settings Index(fetchUserDetails):', e)
      this.setState({ isLoading: false })
    }
  }

  adminAccordion = () => {
    const { activeIndex, userData, isLoading } = this.state
    const { userLoginInfo, callUserAPI } = this.props
    return (
      <Accordion className="l-show">
        <Accordion.Title
          active={activeIndex === 0}
          index={0}
          onClick={this.handleClick}
        >
          <Icon name="dropdown" />
          Personal Details
        </Accordion.Title>
        <Accordion.Content active={activeIndex === 0}>
          <PersonalDetail
            userLoginInfo={userLoginInfo}
            userData={userData}
            isLoading={isLoading}
            fetchUserDetails={this.fetchUserDetails}
            callUserAPI={callUserAPI}
            res="mobile"
          />
        </Accordion.Content>

        <Accordion.Title
          active={activeIndex === 3}
          index={3}
          onClick={this.handleClick}
        >
          <Icon name="dropdown" />
          Notifications
        </Accordion.Title>
        <Accordion.Content active={activeIndex === 3}>
          <Notifications />
        </Accordion.Content>

        <Accordion.Title
          active={activeIndex === 4}
          index={4}
          onClick={this.handleClick}
        >
          <Icon name="dropdown" />
          Change Password
        </Accordion.Title>
        <Accordion.Content active={activeIndex === 4}>
          <ChangePassword userData={userData} />
        </Accordion.Content>

        <Accordion.Content active={activeIndex === 5}>
          <HelpAndSupport />
        </Accordion.Content>
        <Accordion.Title
          active={activeIndex === 6}
          index={6}
          onClick={this.handleClick}
        >
          <Icon name="dropdown" />
          FAQs
        </Accordion.Title>
        <Accordion.Content active={activeIndex === 6}>
          <Faq />
        </Accordion.Content>

        <Accordion.Title
          active={activeIndex === 7}
          index={7}
          onClick={this.handleClick}
        >
          <Icon name="dropdown" />
          Terms &amp; Conditions
        </Accordion.Title>
        <Accordion.Content active={activeIndex === 7}>
          <TermsAndCondition />
        </Accordion.Content>
      </Accordion>
    )
  }

  consumerAccordion = () => {
    const { activeIndex, userData, isLoading } = this.state
    const { userLoginInfo, callUserAPI } = this.props
    return (
      <Accordion className="l-show">
        <Accordion.Title
          active={activeIndex === 0}
          index={0}
          onClick={this.handleClick}
        >
          <Icon name="dropdown" />
          Personal Details
        </Accordion.Title>
        <Accordion.Content active={activeIndex === 0}>
          <PersonalDetail
            userLoginInfo={userLoginInfo}
            userData={userData}
            isLoading={isLoading}
            fetchUserDetails={this.fetchUserDetails}
            callUserAPI={callUserAPI}
            res="mobile"
          />
        </Accordion.Content>

        <Accordion.Title
          active={activeIndex === 2}
          index={2}
          onClick={this.handleClick}
        >
          <Icon name="dropdown" />
          Bank Details
        </Accordion.Title>
        <Accordion.Content active={activeIndex === 2}>
          <BankDetail />
        </Accordion.Content>
        <Accordion.Title
          active={activeIndex === 3}
          index={3}
          onClick={this.handleClick}
        >
          <Icon name="dropdown" />
          Notifications
        </Accordion.Title>
        <Accordion.Content active={activeIndex === 3}>
          <Notifications />
        </Accordion.Content>

        <Accordion.Title
          active={activeIndex === 4}
          index={4}
          onClick={this.handleClick}
        >
          <Icon name="dropdown" />
          Change Password
        </Accordion.Title>
        <Accordion.Content active={activeIndex === 4}>
          <ChangePassword userData={userData} />
        </Accordion.Content>

        <Accordion.Title
          active={activeIndex === 5}
          index={5}
          onClick={this.handleClick}
        >
          <Icon name="dropdown" />
          Help &amp; Support
        </Accordion.Title>
        <Accordion.Content active={activeIndex === 5}>
          <HelpAndSupport />
        </Accordion.Content>
        <Accordion.Title
          active={activeIndex === 6}
          index={6}
          onClick={this.handleClick}
        >
          <Icon name="dropdown" />
          FAQs
        </Accordion.Title>
        <Accordion.Content active={activeIndex === 6}>
          <Faq />
        </Accordion.Content>

        <Accordion.Title
          active={activeIndex === 7}
          index={7}
          onClick={this.handleClick}
        >
          <Icon name="dropdown" />
          Terms &amp; Conditions
        </Accordion.Title>
        <Accordion.Content active={activeIndex === 7}>
          <TermsAndCondition />
        </Accordion.Content>
      </Accordion>
    )
  }

  handleClick = (e, titleProps) => {
    const { index } = titleProps
    const { activeIndex } = this.state
    const newIndex = activeIndex === index ? -1 : index

    this.setState({ activeIndex: newIndex })
  }

  render() {
    const { activeIndex } = this.state
    return (
      <div className="fluid-container consumer-setting-page">
        <Tab
          className="l-hide"
          menu={{ secondary: true, pointing: true }}
          activeIndex={activeIndex}
          panes={
            roles.includes(localStorage.getItem('role'))
              ? this.adminPanes
              : this.consumerPanes
          }
          onTabChange={(e, { activeIndex }) => this.setState({ activeIndex })}
        />
        {roles.includes(localStorage.getItem('role'))
          ? this.adminAccordion()
          : this.consumerAccordion()}
      </div>
    )
  }
}

index.propTypes = {
  userLoginInfo: propTypes.objectOf(propTypes.object).isRequired,
  location: propTypes.shape({
    pathname: propTypes.string.isRequired, // shape it as reducer have multiple states which we need to address and this is for object
  }).isRequired,
  callUserAPI: propTypes.func.isRequired,
}

const mapStateToProps = (state) => ({
  userLoginInfo: state.userLoginInfo,
})

export default connect(mapStateToProps, { ...loginAction })(index)
