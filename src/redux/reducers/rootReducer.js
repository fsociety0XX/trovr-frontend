import { combineReducers } from 'redux'
import user from './userReducer'
import userLoginInfo from './loginReducer'
import segment from './SegmentReducer'
import rewards from './consumerRewardsReducer'
import wallet from './consumerWalletReducer'

// plopImport

// list all the new register reducers here from your reducer folder to merge them and export
export default combineReducers({
  user,
  userLoginInfo,
  segment,
  rewards,
  wallet,
  // plopReducer
})
