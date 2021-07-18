import api from '../index'

class TriggerService {
  static fetchTriggerList = async (queryParam) =>
    api({
      method: 'GET',
      endpoint: '/trigger',
      usingAuthToken: true,
      queryParam,
    })

  static fetchTriggerDetail = async (id) =>
    api({
      method: 'GET',
      endpoint: `/trigger/${id}`,
      usingAuthToken: true,
    })

  static createTrigger = async (data) =>
    api({
      method: 'POST',
      endpoint: '/trigger',
      usingAuthToken: true,
      data,
    })

  static updateTrigger = async (data, id) =>
    api({
      method: 'PUT',
      endpoint: '/trigger/',
      usingAuthToken: true,
      data,
      queryParam: id,
    })

  static deleteTrigger = async (id) =>
    api({
      method: 'DELETE',
      endpoint: `/trigger/${id}`,
      usingAuthToken: true,
    })
}

export default TriggerService
