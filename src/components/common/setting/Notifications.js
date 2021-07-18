import React, { useEffect, useState } from 'react'
import dayjs from 'dayjs'
import { Message } from 'semantic-ui-react'
import propTypes from 'prop-types'
import { connect } from 'react-redux'
import NotificationService from '../../../api/services/NotificationService'
import Notification from '../../../svgs/Notification'
import NotificationColoured from '../../../svgs/NotificationColoured'
import Loader from '../../../utils/Loader'
import * as userAction from '../../../redux/actions/userAction'
import { noDataFound } from '../../../utils/messages'

const Notifications = (props) => {
  const { fetchNotificationCount } = props
  const limit = 10
  const [loading, setLoading] = useState(false)
  const [notificationList, setNotificationList] = useState([])
  const [totalPages, setTotalPages] = useState(1)
  const [currentPage, setCurrentPage] = useState(1)

  const readNotifications = async () => {
    try {
      await NotificationService.readAllNotifications()
      fetchNotificationCount()
    } catch (err) {
      console.warn(err, 'readNotifications')
    }
  }

  const noResults = () => <Message info content={noDataFound} />

  const getNotificationList = async () => {
    const queryParam = `?page=${currentPage}&limit=${limit}`
    setLoading(true)
    try {
      const response = await NotificationService.fetchUserNotificationList(
        queryParam
      )
      setNotificationList([...notificationList, ...response?.notifications])
      setTotalPages(response?.totalPages)
      setLoading(false)
      readNotifications()
    } catch (error) {
      setLoading(false)
      console.warn('getAllNotifications:', error)
    }
  }

  const handleScroll = () => {
    if (totalPages !== currentPage) {
      if (
        window.innerHeight + document.documentElement.scrollTop ===
        document.scrollingElement.scrollHeight
      ) {
        const newPage = currentPage + 1
        setCurrentPage(newPage)
      }
    }
  }

  useEffect(() => {
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [currentPage])

  useEffect(() => {
    getNotificationList()
  }, [currentPage])

  return (
    <div className="notification-tab">
      {loading ? (
        <Loader className="screen-centered" />
      ) : (
        <>
          {notificationList?.length > 0 ? (
            <div className="items">
              {notificationList?.map((data) => {
                const {
                  description,
                  isRead,
                  createdAt,
                  notificationName,
                } = data
                return (
                  <div className="item">
                    <div className="icon">
                      {isRead ? <Notification /> : <NotificationColoured />}
                    </div>
                    <div className="content">
                      {' '}
                      <strong> {notificationName} </strong> {description}
                    </div>
                    <div className="time">{`${dayjs(
                      new Date(`${createdAt} UTC`)
                    ).format('DD MMM YYYY')}, ${dayjs(
                      new Date(`${createdAt} UTC`)
                    ).format('hh:mm A')}`}</div>
                  </div>
                )
              })}
            </div>
          ) : (
            noResults()
          )}
        </>
      )}
    </div>
  )
}

const mapStateToProps = (state) => ({
  notificationCount: state.user.notificationCount,
})

Notifications.propTypes = {
  fetchNotificationCount: propTypes.func.isRequired,
}

export default connect(mapStateToProps, { ...userAction })(Notifications)
