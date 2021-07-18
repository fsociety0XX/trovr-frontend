import api from '../index'

class SegmentService {
  /**
   * @author Priyanka
   * @use this method will be required for getting ssegment list
   * @param {*} data
   * @returns
   */
  static segmentList = async (data = null) =>
    api({
      method: 'GET',
      endpoint: `/segment`,
      usingAuthToken: true,
      queryParam: data,
    })

  /**
   * @author Priyanka
   * @use this method will be required for getting segment list
   * @param {*} data
   * @returns
   */
  static allSegmentList = async (data = null) =>
    api({
      method: 'GET',
      endpoint: `/segment/all`,
      usingAuthToken: true,
      queryParam: data,
    })

  /**
   * @author Priyanka
   * @use this method will be required to delete segment
   * @param {*} data
   * @returns
   */
  static deleteSegment = async (id) =>
    api({
      method: 'DELETE',
      endpoint: `/segment/${id}`,
      usingAuthToken: true,
    })

  /**
   * @author Priyanka
   * @use this method will be required to create segment
   * @param {*} data
   * @returns
   */
  static createSegment = async (data) =>
    api({
      method: 'POST',
      endpoint: `/segment`,
      usingAuthToken: true,
      data,
    })

  /**
   * @author Priyanka
   * @use this method will be required to edit segment
   * @param {*} data
   * @returns
   */
  static editSegment = async (data, id) =>
    api({
      method: 'PUT',
      endpoint: `/segment/${id}`,
      usingAuthToken: true,
      data,
    })
}

export default SegmentService
