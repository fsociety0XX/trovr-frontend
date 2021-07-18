import React, { Component } from 'react'
import propTypes from 'prop-types'
import { connect } from 'react-redux'
import { Input, Dropdown } from 'semantic-ui-react'
import Geocode from 'react-geocode'
import RewardList from '../common/RewardList'
import * as consumerAction from '../../../redux/actions/consumerRewardsAction'
import { withToast } from '../../../utils/helper'
import Loader from '../../../utils/Loader'
import Search from '../../../svgs/Search'
import Calendar from '../../../svgs/Calendar'
import SearchFilter from '../../../svgs/SearchFilter'
import ConsumerService from '../../../api/services/ConsumerService'
import * as url from '../../../utils/urls'
import { locationError } from '../../../utils/messages'

const options = [
  { key: 1, text: 'All', value: 'all' },
  { key: 2, text: 'Week', value: 'week' },
  { key: 3, text: 'Month', value: 'month' },
  { key: 4, text: 'Year', value: 'year' },
]
let searchTimeout = null
class index extends Component {
  constructor(props) {
    super(props)
    this.state = {
      list: null,
      loading: false,
      limit: -1,
      page: 1,
      columns: 3,
      isFav: null,
      applyFilter: false,
      totalRecords: 0,
      walletFilterValue: 'all',
      postcode: '',
      savedRewards: false,
      searchValue: '',
      filterObj: {}, // Maintain availabel rewards filter
    }
  }

  componentDidMount() {
    this.setState({ loading: true })
    const { isFav, columns, noOfItems, addToast } = this.props
    const isfavourite = this.setFav()
    this.setState({
      isFav: this.setFav(),
    })
    const defaultPostCode = '666666' // TODO: make postcode dynamic
    let filterObject = {
      proximity: false,
      postcode: '',
    }
    // Get user's current location and postcode from latitude & longitude
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords
        Geocode.setApiKey(process.env.GOOGLE_MAP_API_KEY)

        Geocode.fromLatLng(latitude, longitude).then(
          (response) => {
            response?.results[0]?.address_components?.forEach((data) => {
              if (data.types[0] === 'postal_code') {
                filterObject = {
                  proximity: true,
                  postcode: data.long_name,
                }
                filterObject.postcode = data.long_name
                this.setState({ postcode: data.long_name })
                this.checkData(isfavourite, data.long_name) // fetch rewards in dashboard
                this.fetchList(1, true, data.long_name) // fetch wallet in dashboard
                this.setState({ loading: false })
              }
              this.setState({ filterObj: filterObject })
            })
          },
          (error) => {
            filterObject = {
              proximity: true,
              postcode: defaultPostCode,
            }
            filterObject.postcode = defaultPostCode
            this.setState({
              postcode: defaultPostCode,
              loading: false,
              filterObj: filterObject,
            })
            console.warn(error, 'error in fetching postcode')
            this.checkData(isfavourite, defaultPostCode) // fetch rewards in dashboard
            this.fetchList(1, true, defaultPostCode) // fetch wallet in dashboard
          }
        )
      },
      (error) => {
        // show only on page refresh
        if (
          localStorage.getItem('locationNoti') == null ||
          localStorage.getItem('locationNoti') === 'false'
        ) {
          addToast(locationError, { appearance: 'info' })
        }
        localStorage.setItem('locationNoti', true)
        this.setState({ loading: false })
        this.checkData(isfavourite) // fetch rewards in dashboard
        this.fetchList(1, true) // fetch wallet in dashboard
        console.warn(error, 'error in geolocation')
      }
    )
    if (columns !== undefined) {
      this.setState({
        columns,
        isFav,
      })
    }
    noOfItems && this.setState({ limit: noOfItems })
  }

  static getDerivedStateFromProps = (props) => {
    const { noOfItems } = props
    if (noOfItems) {
      return {
        limit: noOfItems,
      }
    }
    return null
  }

  componentDidUpdate(prevProps) {
    const { rewards, wallet, location } = this.props
    const { postcode } = this.state
    const isfavourite = this.setFav()
    if (prevProps.location !== location) {
      this.checkData(isfavourite, postcode)
      this.resetSearchValue()
    }
    // set data after page refresh
    if (!isfavourite) {
      if (prevProps.rewards.vouchers !== rewards.vouchers) {
        this.setData(rewards, isfavourite)
      }
      if (prevProps.rewards.loading !== rewards.loading) {
        this.setLoading(rewards)
      }
      if (prevProps.rewards.rewardSaved !== rewards.rewardSaved) {
        this.setSavedRewards(rewards)
      }
    } else {
      if (prevProps.wallet.vouchers !== wallet.vouchers) {
        this.setData(wallet, isfavourite)
      }
      if (prevProps.wallet.loading !== wallet.loading) {
        this.setLoading(wallet)
      }
      if (prevProps.wallet.rewardSaved !== wallet.rewardSaved) {
        this.setSavedRewards(wallet)
      }
    }
  }

  setLimit = (data) => {
    this.setState({ limit: data })
  }

  setLoading = (data) => {
    this.setState({
      loading: data.loading,
    })
  }

  setSavedRewards = (data) => {
    this.setState({
      savedRewards: data.rewardSaved,
    })
  }

  resetSearchValue = () => {
    this.setState({ searchValue: '' })
  }

  /*
  @author:sadikali
  Check data in redux and then fetch from api
  */
  checkData = (isfavourite, postcode = null) => {
    let filterObject = {
      proximity: false,
      postcode: '',
    }
    if (postcode !== '') {
      filterObject = {
        proximity: true,
        postcode,
      }
    }
    const { walletFilterValue, filterObj } = this.state
    const { rewards, wallet } = this.props
    if (isfavourite) {
      if (wallet?.vouchers?.length !== 0 && walletFilterValue === 'all') {
        this.setData(wallet, isfavourite)
      } else {
        this.setState({ walletFilterValue: 'all', page: 1 })
        this.fetchList(1, isfavourite) // page, isFav, postcode, fetchmoreflag
      }
    } else if (
      rewards?.vouchers?.length !== 0 &&
      Object.keys(filterObj).length === 0
    ) {
      this.setData(rewards, isfavourite)
    } else {
      this.setState({ filterObj: filterObject, page: 1 })
      // page, isFav, postcode, fetchmoreflag
      this.fetchList(1, isfavourite, postcode, false) // false to fetch available rewards
    }
  }

  /*
  @author:sadikali
  Set fav state for wallet and rewards accordingly
  */

  setFav = () => {
    const { isFav, location } = this.props
    if (location.pathname === url.rewards) {
      return false
    } else if (location.pathname === url.wallet) {
      return true
    } else {
      return isFav
    }
  }

  /*
  @author:sadikali
  Set state after getting data from api
  */

  setData = (data, isFav) => {
    this.setState({
      list: data.vouchers,
      totalRecords: data.list.totalRecords,
      loading: data.loading,
      page: data.page,
      isFav,
      savedRewards: data.rewardSaved,
    })
  }

  /*
  @author:sadikali
  Fetch list for search
  */

  handleSearch = (e, data) => {
    const { filterObj, walletFilterValue, isFav } = this.state
    // searchValue
    let filterObject = filterObj
    if (isFav && filterObject === '') {
      filterObject = 'all'
    }
    this.setState({
      searchValue: data.value,
    })
    if (searchTimeout !== null) {
      clearTimeout(searchTimeout)
    }
    searchTimeout = setTimeout(() => {
      if (!isFav) {
        this.fetchfilterList(filterObject, data.value) // filterData, searchText  , fetchmore, nextpage
      } else if (isFav) {
        this.fetchfilterList(walletFilterValue, data.value)
      }
    }, 500)
  }

  /*
  @author:sadikali
  Fetch list for search and filter
  */

  fetchfilterList = async (
    filterData = null,
    searchData = '',
    fetchmore = false,
    page = 1
  ) => {
    const { isFav, postcode, list } = this.state
    let updatedPostCode = ''
    if (postcode !== filterData.postcode) {
      updatedPostCode = filterData.postcode
    } else if (postcode) {
      updatedPostCode = postcode
    }
    const limit = 9
    let queryString = {}
    this.setState({ page })
    if (isFav) {
      queryString = {
        page,
        limit,
        frequentlyUsed: false,
      }
      filterData !== 'all' &&
        Object.assign(queryString, { expiredWithin: filterData })
    } else {
      queryString = {
        page,
        limit,
      }
      updatedPostCode !== '' &&
        !isFav &&
        Object.assign(queryString, { postcode: updatedPostCode })
      filterData.type && Object.assign(queryString, { type: filterData.type })
      filterData.expiredWithin &&
        Object.assign(queryString, { expiredWithin: filterData.expiredWithin })
      filterData.frequentlyUsed &&
        Object.assign(queryString, {
          frequentlyUsed: filterData.frequentlyUsed,
        })
    }
    searchData && Object.assign(queryString, { search: searchData })
    this.setState({
      loading: true,
    })
    try {
      let endpoint = '/voucher/consumer/wallet'
      if (!isFav) {
        endpoint = '/voucher/consumerVoucher'
      }
      const response = await ConsumerService.fetchRewards(queryString, endpoint)
      if (fetchmore) {
        this.setState({
          list: [...list, ...response.vouchers],
        })
      } else {
        this.setState({
          list: response.vouchers,
        })
      }
      this.setState({
        loading: false,
        totalRecords: response.totalRecords,
      })
    } catch (e) {
      console.warn('Merchant List:', e)
      this.setState({
        loading: false,
      })
    }
  }

  /*
  @author:sadikali
  Fetch list on see more click
  */

  fetchMore = () => {
    const {
      page,
      isFav,
      searchValue,
      filterObj,
      walletFilterValue,
    } = this.state
    let filterObject = filterObj
    if (isFav && filterObject === '') {
      filterObject = 'all'
    }
    this.setState({ page: page + 1 })

    if (!isFav) {
      this.fetchfilterList(filterObject, searchValue, true, page + 1) // filterData, searchText  , fetchmore, nextpage
    } else if (isFav) {
      this.fetchfilterList(walletFilterValue, searchValue, true, page + 1) // filterData, searchText  , fetchmore, nextpage
    }
  }

  /*
  @author:sadikali
  Call api to fetch list
  */

  fetchList = (page = 1, isFav, postcode = null, fetchMore = false) => {
    const { fetchRewardList } = this.props
    fetchRewardList(page, isFav, postcode, fetchMore) // page ,isfav, postcode, fetchMore
  }

  /*
  @author:sadikali
  Call api after click on saved later button
  */

  saveforLaterReward = async (id) => {
    const { addToast } = this.props
    const { isFav, filterObj, walletFilterValue, searchValue } = this.state

    const queryString = {
      isFavourite: !isFav,
    }
    const queryParam = `/${id}`
    this.setState({
      loading: true,
    })
    let filterObject = filterObj
    if (isFav && filterObject === '') {
      filterObject = 'all'
    }
    try {
      const endpoint = '/voucher/favourite'
      const response = await ConsumerService.saveLaterRewards(
        queryParam,
        queryString,
        endpoint
      )
      if (Object.keys(response).length === 0) {
        this.setState({
          loading: false,
        })
        let rewardStoredmessage
        if (!isFav) {
          this.fetchList(1, true)
          rewardStoredmessage = 'The reward is stored in your wallet'
        } else {
          this.fetchList(1, false)
          rewardStoredmessage = 'Voucher removed'
        }

        addToast(rewardStoredmessage, { appearance: 'info' })
      }
    } catch (e) {
      console.warn('Merchant List:', e)
      this.setState({
        loading: false,
        page: 1,
      })
    }

    if (!isFav) {
      this.fetchfilterList(filterObject, searchValue, false, 1) // filterData, searchText  , fetchmore, nextpage
    } else if (isFav) {
      this.fetchfilterList(walletFilterValue, searchValue, false, 1) // filterData, searchText  , fetchmore, nextpage
    }
  }

  /*
  @author:sadikali
  Show hide filter popup
  */
  handleRewardsFilter = (status) => {
    const { applyFilter } = this.state
    if (status) {
      this.setState({ applyFilter: status })
    } else {
      this.setState({ applyFilter: !applyFilter })
    }
  }

  /*
  @author:sadikali
  store rewards filter data in state
  */

  handleFilterFormData = async (data, filterObj = {}) => {
    const { searchValue } = this.state
    this.setState({ filterObj })
    this.fetchfilterList(data, searchValue)
  }

  /*
  @author:sadikali
  store wallet filter data in state
  */

  handleWalletFilter = (e, { value }) => {
    const { searchValue } = this.state
    this.fetchfilterList(value, searchValue)
    this.setState({
      walletFilterValue: value,
    })
  }

  render() {
    const {
      list,
      loading,
      limit,
      columns,
      applyFilter,
      totalRecords,
      walletFilterValue,
      isFav,
      postcode,
      savedRewards,
      searchValue,
      filterObj,
    } = this.state
    const { location, userLoginInfo, seemore } = this.props
    const { data } = userLoginInfo.userLoginInfo
    let consumerId = ''
    if (data.user !== undefined) {
      consumerId = data.user.role?.[0].id
    } else {
      consumerId = data.role?.[0].id
    }
    return (
      <div
        className={`container ${
          location === 'dashboard' ? 'dashboard-list' : 'rewards-page'
        } `}
      >
        <div className="header-segment clearfix">
          <div className="header-title">
            <div className="title">
              {`${
                isFav !== null
                  ? isFav
                    ? 'Saved Rewards'
                    : 'Available Rewards'
                  : ''
              }`}{' '}
            </div>
          </div>
          <div className="header-dropdown">
            {location === 'dashboard' ? (
              !isFav ? (
                <div
                  onKeyDown={this.handleRewardsFilter}
                  onClick={this.handleRewardsFilter}
                  className="rewards-filter-wrapper"
                >
                  <SearchFilter /> Filter
                </div>
              ) : (
                <div className="ui left icon select rewards-filter-wrapper">
                  <Calendar />
                  <Dropdown
                    options={options}
                    value={walletFilterValue}
                    placeholder="All"
                    onChange={this.handleWalletFilter}
                    fluid
                    selection
                    defaultValue="all"
                  />
                </div>
              )
            ) : (
              <div className="search-with-filter">
                {location !== 'dashboard' && (
                  <Input
                    iconPosition="left"
                    onChange={this.handleSearch}
                    placeholder="Search"
                    value={searchValue}
                  >
                    <Search />
                    <input maxLength="255" />
                  </Input>
                )}

                {!isFav ? (
                  <div
                    onKeyDown={this.handleRewardsFilter}
                    onClick={this.handleRewardsFilter}
                    className="search-filter-wrapper"
                  >
                    <SearchFilter />
                  </div>
                ) : (
                  <>
                    <Dropdown
                      options={options}
                      value={walletFilterValue}
                      placeholder="All"
                      onChange={this.handleWalletFilter}
                      fluid
                      selection
                      defaultValue="all"
                    />
                    <div className="search-filter-wrapper">
                      <SearchFilter />
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
        {location === 'dashboard' ? (
          loading ? (
            <Loader className="section-centered" />
          ) : (
            <>
              {consumerId !== '' ? (
                <RewardList
                  title="Available Rewards"
                  columns={columns}
                  noOfItems={limit}
                  loading={loading}
                  rewardData={list}
                  refreshList={this.fetchList}
                  saveforLaterReward={this.saveforLaterReward}
                  isFav={isFav}
                  rewardSaved={savedRewards}
                  fetchMore={this.fetchMore}
                  roleId={consumerId}
                  applyFilter={applyFilter}
                  handleRewardsFilter={this.handleRewardsFilter}
                  handleFilterFormData={this.handleFilterFormData}
                  seemore={seemore}
                  totalRecords={totalRecords}
                  postalCode={postcode}
                  filterObjProps={filterObj}
                />
              ) : (
                ''
              )}
            </>
          )
        ) : (
          <>
            {loading && <Loader className="screen-centered" />}
            {consumerId !== '' ? (
              <RewardList
                title="Available Rewards"
                columns={columns}
                noOfItems={limit}
                loading={loading}
                rewardData={list}
                refreshList={this.fetchList}
                saveforLaterReward={this.saveforLaterReward}
                isFav={isFav}
                rewardSaved={savedRewards}
                fetchMore={this.fetchMore}
                roleId={consumerId}
                applyFilter={applyFilter}
                handleRewardsFilter={this.handleRewardsFilter}
                handleFilterFormData={this.handleFilterFormData}
                seemore={seemore}
                totalRecords={totalRecords}
                postalCode={postcode}
                filterObjProps={filterObj}
              />
            ) : (
              ''
            )}
          </>
        )}
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  rewards: state.rewards,
  wallet: state.wallet,
  userLoginInfo: state.userLoginInfo,
})

export default withToast(connect(mapStateToProps, { ...consumerAction })(index))

index.propTypes = {
  location: propTypes.shape({
    pathname: propTypes.string.isRequired, // shape it as reducer have multiple states which we need to address and this is for object
  }).isRequired,
  rewards: propTypes.objectOf(propTypes.object).isRequired,
  wallet: propTypes.objectOf(propTypes.object).isRequired,
  fetchRewardList: propTypes.func.isRequired,
  userLoginInfo: propTypes.objectOf(propTypes.object).isRequired,
  columns: propTypes.number.isRequired,
  isFav: propTypes.bool.isRequired,
  noOfItems: propTypes.number.isRequired,
  seemore: propTypes.string.isRequired,
  addToast: propTypes.func.isRequired,
}
