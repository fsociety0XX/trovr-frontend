import React from 'react'
import { Router, Switch } from 'react-router-dom'
import { createBrowserHistory } from 'history'
import { ToastProvider } from 'react-toast-notifications'
import Auth from '../components/common/Auth'
import ConsumerLayout from '../components/layout/consumer/ConsumerLayout'
import StaticLayout from '../components/layout/staticLayout/StaticLayout'
import AdminLayout from '../components/layout/admin/AdminLayout'
import Login from '../components/login'
import PersonalSetting from '../components/common/setting'
import ConsumerRewards from '../components/consumer/rewards'
import TermsAndCondition from '../components/static/TermsAndCondition'
import four0four from '../utils/four0four'
import Consumer from '../components/admin/consumer'
import Merchant from '../components/admin/merchant'
import Voucher from '../components/admin/voucher'
import ThirdParty from '../components/admin/settings/thirdParty'
import Staff from '../components/admin/settings/staff'
import * as url from '../utils/urls'
import Dashboard from '../components/dashboard'
import Banner from '../components/admin/cms/banner'
import UserAlert from '../components/admin/cms/alert'
import Trigger from '../components/admin/settings/trigger'
import Reporting from '../components/admin/reporting'
import MobileAppStore from '../components/static/MobileAppStore'

const AppRoutes = () => {
  const history = createBrowserHistory()

  return (
    <ToastProvider autoDismiss>
      <Router history={history}>
        <Switch>
          <Auth
            exact
            path={url.mobileAppStore}
            component={MobileAppStore}
            layout={false}
            roles={['all']}
            authRequired={false}
          />
          <Auth
            exact
            path={url.login}
            component={Login}
            layout={false}
            roles={['all']}
            authRequired={false}
          />
          <Auth
            exact
            path={url.dashboard}
            component={Dashboard}
            layout={false}
            roles={['systemAdmin', 'consumer', 'systemManager', 'systemUser']} // need to change to consumer
            authRequired
          />
          <Auth
            exact
            path={url.rewards}
            component={ConsumerRewards}
            layout={ConsumerLayout}
            roles={['consumer']}
            authRequired
          />

          <Auth
            exact
            path={url.wallet}
            component={ConsumerRewards}
            layout={ConsumerLayout}
            roles={['consumer']}
            authRequired
          />
          <Auth
            exact
            path={url.register}
            component={Login}
            layout={false}
            roles={['all']}
            authRequired={false}
          />
          <Auth
            exact
            path={url.verification}
            component={Login}
            layout={false}
            roles={['all']}
            authRequired={false}
          />
          <Auth
            exact
            path={url.forgotPassword}
            component={Login}
            layout={false}
            roles={['all']}
            authRequired={false}
          />
          <Auth
            exact
            path={url.termsConditions}
            component={TermsAndCondition}
            layout={StaticLayout}
            roles={['all']}
            authRequired={false}
          />
          <Auth
            exact
            path={url.settings}
            component={PersonalSetting}
            layout={ConsumerLayout}
            roles={['consumer']}
            authRequired
          />

          <Auth
            exact
            path={url.adminPersonalSettings}
            component={PersonalSetting}
            layout={AdminLayout}
            roles={['systemAdmin', 'systemManager', 'systemUser']}
            authRequired
          />

          <Auth
            exact
            path={url.notifications}
            component={PersonalSetting}
            layout={ConsumerLayout}
            roles={['systemAdmin', 'consumer', 'systemManager', 'systemUser']}
            authRequired
          />

          <Auth
            exact
            path={url.adminNotifications}
            component={PersonalSetting}
            layout={AdminLayout}
            roles={['systemAdmin', 'consumer', 'systemManager', 'systemUser']}
            authRequired
          />

          {/* Admin routes */}

          <Auth
            exact
            path={url.consumer}
            layout={AdminLayout}
            component={Consumer}
            roles={['systemAdmin', 'systemUser', 'systemManager']}
            authRequired
          />

          <Auth
            exact
            path={url.consumerCreate}
            layout={AdminLayout}
            component={Consumer}
            roles={['systemAdmin', 'systemUser', 'systemManager']}
            authRequired
          />
          <Auth
            exact
            path={url.consumerUpdate}
            layout={AdminLayout}
            component={Consumer}
            roles={['systemAdmin', 'systemUser', 'systemManager']}
            authRequired
          />
          <Auth
            exact
            path={url.consumerHistory}
            layout={AdminLayout}
            component={Consumer}
            roles={['systemAdmin']}
            authRequired
          />
          <Auth
            exact
            path={url.consumerId}
            layout={AdminLayout}
            component={Consumer}
            roles={['systemAdmin']}
            authRequired
          />
          <Auth
            exact
            path={url.merchant}
            layout={AdminLayout}
            component={Merchant}
            roles={['systemAdmin', 'consumer', 'systemManager', 'systemUser']}
            authRequired
          />
          <Auth
            exact
            path={url.merchantCreate}
            layout={AdminLayout}
            component={Merchant}
            roles={['systemAdmin', 'consumer', 'systemManager', 'systemUser']}
            authRequired
          />
          <Auth
            exact
            path={url.merchantUpdate}
            layout={AdminLayout}
            component={Merchant}
            roles={['systemAdmin', 'consumer', 'systemManager', 'systemUser']}
            authRequired
          />
          <Auth
            exact
            path={url.voucher}
            layout={AdminLayout}
            component={Voucher}
            roles={['systemAdmin', 'systemUser', 'systemManager']}
            authRequired
          />
          <Auth
            exact
            path={url.voucherCreate}
            layout={AdminLayout}
            component={Voucher}
            roles={['systemAdmin', 'systemUser', 'systemManager']}
            authRequired
          />
          <Auth
            exact
            path={url.voucherUpdate}
            layout={AdminLayout}
            component={Voucher}
            roles={['systemAdmin', 'systemUser', 'systemManager']}
            authRequired
          />
          <Auth
            exact
            path={url.banner}
            layout={AdminLayout}
            component={Banner}
            roles={['systemAdmin', 'systemUser', 'systemManager']}
            authRequired
          />
          <Auth
            exact
            path={url.bannerCreate}
            layout={AdminLayout}
            component={Banner}
            roles={['systemAdmin', 'systemUser', 'systemManager']}
            authRequired
          />
          <Auth
            exact
            path={url.bannerUpdate}
            layout={AdminLayout}
            component={Banner}
            roles={['systemAdmin', 'systemUser', 'systemManager']}
            authRequired
          />

          <Auth
            exact
            path={url.adminSettings}
            layout={AdminLayout}
            component={ThirdParty}
            roles={['systemAdmin', 'systemManager']}
            authRequired
          />

          <Auth
            exact
            path={url.staff}
            layout={AdminLayout}
            component={Staff}
            roles={['systemAdmin', 'systemManager']}
            authRequired
          />
          <Auth
            exact
            path={url.staffCreate}
            layout={AdminLayout}
            component={Staff}
            roles={['systemAdmin', 'systemManager']}
            authRequired
          />
          <Auth
            exact
            path={url.staffUpdate}
            layout={AdminLayout}
            component={Staff}
            roles={['systemAdmin', 'systemManager']}
            authRequired
          />

          <Auth
            exact
            path={url.trigger}
            layout={AdminLayout}
            component={Trigger}
            roles={['systemAdmin']}
            authRequired
          />

          <Auth
            exact
            path={url.triggerCreate}
            layout={AdminLayout}
            component={Trigger}
            roles={['systemAdmin']}
            authRequired
          />

          <Auth
            exact
            path={url.triggerUpdate}
            layout={AdminLayout}
            component={Trigger}
            roles={['systemAdmin']}
            authRequired
          />

          <Auth
            exact
            path={url.userAlert}
            layout={AdminLayout}
            component={UserAlert}
            roles={['systemAdmin', 'systemUser', 'systemManager']}
            authRequired
          />
          <Auth
            exact
            path={url.userAlertCreate}
            layout={AdminLayout}
            component={UserAlert}
            roles={['systemAdmin', 'systemUser', 'systemManager']}
            authRequired
          />
          <Auth
            exact
            path={url.userAlertUpdate}
            layout={AdminLayout}
            component={UserAlert}
            roles={['systemAdmin', 'systemUser', 'systemManager']}
            authRequired
          />

          <Auth
            exact
            path={url.transactionReport}
            layout={AdminLayout}
            component={Reporting}
            roles={['systemAdmin', 'systemUser', 'systemManager']}
            authRequired
          />

          <Auth
            exact
            path={url.voucherRedemptionReport}
            layout={AdminLayout}
            component={Reporting}
            roles={['systemAdmin', 'systemUser', 'systemManager']}
            authRequired
          />

          {/* DONOT put any route below this */}
          <Auth
            path="*"
            component={four0four}
            layout={false}
            roles={['all']}
            authRequired={false}
          />
        </Switch>
      </Router>
    </ToastProvider>
  )
}

export default AppRoutes
