import React from 'react'
import { NavLink } from 'react-router-dom'
import propTypes from 'prop-types'
import CMS from '../../../svgs/CMS'
import Consumer from '../../../svgs/Consumer'
import Voucher from '../../../svgs/Voucher'
import Merchant from '../../../svgs/Merchant'
import Reporting from '../../../svgs/Reporting'
import * as url from '../../../utils/urls'

const Sidebar = ({ parentPath }) => (
  <div className="sidebar">
    <ul>
      <li>
        <NavLink
          to={{
            pathname: url.banner,
            fromSidebar: 'true',
          }}
          className={parentPath.children === 'cms' ? 'active' : ''}
        >
          <CMS /> <span className="menu-text">CMS</span>
        </NavLink>
      </li>
      <li>
        <NavLink
          to={{
            pathname: url.voucher,
            fromSidebar: 'true',
          }}
        >
          <Voucher /> <span className="menu-text">Voucher</span>
        </NavLink>
      </li>
      <li>
        <NavLink
          to={{
            pathname: url.consumer,
            fromSidebar: 'true',
          }}
        >
          <Consumer /> <span className="menu-text">Consumer</span>
        </NavLink>
      </li>
      <li>
        <NavLink
          to={{
            pathname: url.merchant,
            fromSidebar: 'true',
          }}
        >
          <Merchant /> <span className="menu-text">Merchant</span>
        </NavLink>
      </li>
      {localStorage.getItem('role') !== 'systemUser' && (
        <li>
          <NavLink
            to={url.transactionReport}
            className={parentPath.children === 'report' ? 'active' : ''}
          >
            <Reporting /> <span className="menu-text">Reporting</span>
          </NavLink>
        </li>
      )}
    </ul>
  </div>
)

export default Sidebar

Sidebar.propTypes = {
  parentPath: propTypes.objectOf(propTypes.object).isRequired,
}
