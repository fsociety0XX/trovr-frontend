import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import Routes from './routes/routes'
import store from './redux/store'
import 'semantic-ui-css/semantic.min.css'
import 'react-perfect-scrollbar/dist/css/styles.css'
import './less/main.less'

// Reset notification message for ask location
localStorage.setItem('locationNoti', false)

ReactDOM.render(
  <Provider store={store}>
    <Routes />
  </Provider>,
  document.querySelector('#root')
)
