import api from '../index'

class NotificationService {
  static fetchNotificationList = async (queryParam) =>
    api({
      method: 'GET',
      endpoint: '/notification/adminNotifications',
      usingAuthToken: true,
      queryParam,
    })

  static fetchNotificationDetail = async (queryParam) =>
    api({
      method: 'GET',
      endpoint: '/notification/',
      usingAuthToken: true,
      queryParam,
    })

  static fetchUserNotificationList = async (queryParam) =>
    api({
      method: 'GET',
      endpoint: '/notification',
      usingAuthToken: true,
      queryParam,
    })

  static fetchUserListWithType = async (data) =>
    api({
      method: 'POST',
      endpoint: '/notification/role',
      usingAuthToken: true,
      data,
    })

  static createNotification = async (data) =>
    api({
      method: 'POST',
      endpoint: '/notification',
      usingAuthToken: true,
      data,
    })

  static updateNotification = async (data, id) =>
    api({
      method: 'PUT',
      endpoint: `/notification/${id}`,
      usingAuthToken: true,
      data,
    })

  static deleteNotification = async (id) =>
    api({
      method: 'DELETE',
      endpoint: `/notification/${id}`,
      usingAuthToken: true,
    })

  static fetchNotificationCount = async () =>
    api({
      method: 'GET',
      endpoint: `/notification/unreadNotificationCount`,
      usingAuthToken: true,
    })

  static readAllNotifications = async () =>
    api({
      method: 'PUT',
      endpoint: `/notification/readAllNotifications`,
      usingAuthToken: true,
    })

  static approveRejectNotification = async (data) =>
    api({
      method: 'PUT',
      endpoint: `/notification/updateStatus`,
      usingAuthToken: true,
      data,
    })
}

export default NotificationService
