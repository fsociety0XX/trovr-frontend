import React, { useEffect } from 'react'
import { Route, useHistory } from 'react-router-dom'
import propTypes from 'prop-types'
import Unauthorized from './Unauthorised'

const Auth = ({
  component: Component,
  roles,
  authRequired,
  layout: Layout,
  ...rest
}) => {
  const history = useHistory()
  useEffect(() => {
    if (localStorage.getItem('accessToken') === null && authRequired === true) {
      history.push('/')
    }
  }, [])
  return roles.includes(localStorage.getItem('role')) || roles[0] === 'all' ? (
    <Route
      {...rest}
      render={(props) => (
        <>
          {Layout !== false ? (
            <Layout>
              <Component {...props} />
            </Layout>
          ) : (
            <Component {...props} />
          )}
        </>
      )}
    />
  ) : (
    <Route
      render={() => (
        <>
          <Unauthorized />
        </>
      )}
    />
  )
}
Auth.propTypes = {
  component: propTypes.elementType.isRequired,
  roles: propTypes.instanceOf(Array).isRequired,
  authRequired: propTypes.bool.isRequired,
  layout: propTypes.oneOfType([propTypes.elementType, propTypes.bool])
    .isRequired,
}
export default Auth
