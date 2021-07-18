import React from 'react'
import { Link } from 'react-router-dom'
import FoF from '../svgs/FoF'

function four0four() {
  return (
    <div className="fof-page">
      <div className="error-page-inner">
        <FoF />
        <p>We can’t find the page you’re looking for…</p>
        <Link to="/" className="basic ui button fluid">
          Continue Earning Rewards
        </Link>
      </div>
    </div>
  )
}

export default four0four
