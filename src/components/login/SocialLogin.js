import React from 'react'
import propTypes from 'prop-types'
import FacebookLogin from 'react-facebook-login'
import GoogleLogin from 'react-google-login'
import AppleSignin from 'react-apple-signin-auth'
import AppleSvg from '../../svgs/Apple'
import GoogleSvg from '../../svgs/Google'
import FacebookSvg from '../../svgs/Facebook'
import { handleThirdPartyResponse } from '../../utils/helper'

const Apple = (props) => {
  const { handleSocialResponse } = props
  return (
    <AppleSignin
      authOptions={{
        clientId: `${process.env.APPLE_CLIENT_ID}`,
        scope: 'email name',
        redirectURI: `${process.env.APPLE_REDIRECT_SETTING_URL}`,
        nonce: 'nonce',
        responseType: 'code id_token',
        responseMode: 'form_post',
        usePopup: true,
      }}
      onSuccess={(res) => handleSocialResponse(res, 'apple')}
      onError={(error) => console.warn(error, ': Apple SignIn Login error')} // default = undefined
      className="apple-auth-btn"
      render={(prop) => (
        <button type="button" {...prop}>
          {' '}
          <AppleSvg />
        </button>
      )}
    />
  )
}

const Facebook = (props) => {
  const { handleSocialResponse } = props
  return (
    <div>
      <FacebookLogin
        appId={process.env.FACEBOOK_APP_ID}
        fields="name,email,picture"
        callback={(res) => handleSocialResponse(res, 'facebook')}
        textButton=""
        icon={<FacebookSvg />}
      />
    </div>
  )
}

const Google = (props) => {
  const { handleSocialResponse } = props
  return (
    <div>
      <GoogleLogin
        clientId={process.env.GOOGLE_CLIENT_ID}
        onSuccess={(res) => handleSocialResponse(res, 'google')}
        cookiePolicy="single_host_origin"
        render={(renderProps) => (
          <button
            type="button"
            onClick={renderProps.onClick}
            disabled={renderProps.disabled}
          >
            <GoogleSvg />
          </button>
        )}
      />
    </div>
  )
}

const SocialLogin = (props) => {
  const { sendSocialLoginData } = props
  const handleSocialResponse = async (res, type) => {
    const response = await handleThirdPartyResponse(res, type)
    sendSocialLoginData(response)
  }

  return (
    <div className="another-login-options-wrapper">
      <div className="or-continue-with-text">or continue with</div>
      <div className="another-logins">
        <div className="another-login-item google">
          <Google handleSocialResponse={handleSocialResponse} />
        </div>
        <div className="another-login-item apple">
          <Apple handleSocialResponse={handleSocialResponse} />
        </div>
        <div className="another-login-item facebook">
          <Facebook handleSocialResponse={handleSocialResponse} />
        </div>
      </div>
    </div>
  )
}

Facebook.propTypes = {
  handleSocialResponse: propTypes.func.isRequired,
}

Google.propTypes = {
  handleSocialResponse: propTypes.func.isRequired,
}

Apple.propTypes = {
  handleSocialResponse: propTypes.func.isRequired,
}

SocialLogin.propTypes = {
  sendSocialLoginData: propTypes.func.isRequired,
}

export default SocialLogin
