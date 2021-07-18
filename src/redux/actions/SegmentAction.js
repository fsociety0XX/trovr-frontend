import * as actionTypes from './Types'
import SegmentService from '../../api/services/SegmentService'

/**
 * @author Priyanka Patel
 * @use segment list
 * @params
 * @returns Response of Segment data
 */

export const segmentListInit = () => ({
  type: actionTypes.SEGMENT_INIT,
})

export const segmentListSuccess = (data) => ({
  type: actionTypes.SEGMENT_SUCCESS,
  payload: data,
})

export const segmentListFail = () => ({
  type: actionTypes.SEGMENT_FAIL,
  payload: [],
})

export const segmentList = () => async (dispatch) => {
  dispatch(segmentListInit())
  let response = null
  response = await SegmentService.allSegmentList()
  if (response.length) {
    dispatch(segmentListSuccess(response))
  } else if (response[0]?.message !== undefined) {
    dispatch(segmentListFail(response))
  }
}
