import React from 'react'
import { Header } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import YellowLogo from '../../svgs/YellowLogo'
import SmallLogo from '../../svgs/SmallLogo'
import AppleAppStore from '../../svgs/AppleAppStore'
import DownloadGoogleWeb from '../../assets/images/btn_Download_Google_web.png'

const MobileAppStore = () => {
  /**
   * Determine the mobile operating system.
   * This function returns one of 'iOS', 'Android', 'Windows Phone', or 'unknown'.
   *
   * @returns {String}
   */
  const getMobileOperatingSystem = () => {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera

    // Windows Phone must come first because its UA also contains "Android"
    if (/windows phone/i.test(userAgent)) {
      return 'Windows Phone'
    }

    if (/android/i.test(userAgent)) {
      return 'Android'
    }

    // iOS detection from: http://stackoverflow.com/a/9039885/177710
    if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
      return 'iOS'
    }

    return 'unknown'
  }
  const redirectPage = () => {
    if (mobileAppStoreStatus === 'Android') {
      setTimeout(() => {
        window.location =
          'https://play.google.com/store/apps/details?id=com.facebook.katana&hl=en_IN&gl=US'
      }, 500)
      window.location = 'fb://'
    } else if (mobileAppStoreStatus === 'iOS') {
      setTimeout(() => {
        window.location = 'https://apps.apple.com/us/app/visibly/id1443991581'
      }, 500)
      window.location = 'com.visibly.app://'
    }
  }
  const mobileAppStoreStatus = getMobileOperatingSystem()
  return (
    <div className="mobile-app-page">
      <div className="logo-section">
        <div className="logo">
          <Link to="/">
            <YellowLogo />
          </Link>
        </div>
        <div className="logo-text">
          Consumer{' '}
          {mobileAppStoreStatus === 'Android' || mobileAppStoreStatus === 'iOS'
            ? 'mobile'
            : 'web'}{' '}
          app
        </div>
      </div>
      <div className="description-section">
        <Header as="h2">Description</Header>
        <div className="description">
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
            pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
            culpa qui officia deserunt mollit anim id est laborum.
          </p>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
            pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
            culpa qui officia deserunt mollit anim id est laborum.
          </p>
        </div>
      </div>
      <div className="footer">
        <div className="logo">
          <Link to="/">
            <SmallLogo />
          </Link>
        </div>
        {mobileAppStoreStatus === 'Android' && (
          <div
            className="playstore-logo"
            onClick={() => redirectPage(mobileAppStoreStatus)}
            onKeyDown={() => redirectPage(mobileAppStoreStatus)}
          >
            <img src={DownloadGoogleWeb} alt="Download Andriod App" />
          </div>
        )}
        {mobileAppStoreStatus === 'iOS' && (
          <div
            className="playstore-logo"
            onClick={() => redirectPage(mobileAppStoreStatus)}
            onKeyDown={() => redirectPage(mobileAppStoreStatus)}
          >
            <AppleAppStore />
          </div>
        )}
      </div>
    </div>
  )
}

export default MobileAppStore
