import { useToasts } from 'react-toast-notifications'
import React from 'react'

const UserFunc = () => {
  const { addToast } = useToasts()

  const clickButton = () => {
    addToast('button clicked', { appearance: 'error', autoDismiss: true })
  }
  return (
    <div>
      <button type="button" onClick={clickButton}>
        Click here
      </button>
    </div>
  )
}

export default UserFunc
