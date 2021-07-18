import React, { useState, useEffect } from 'react'
import { Link, useHistory } from 'react-router-dom'
import {
  Header,
  Form,
  Grid,
  Popup,
  Button,
  Modal,
  Input,
} from 'semantic-ui-react'
import dayjs from 'dayjs'
import propTypes from 'prop-types'
import * as url from '../../../../utils/urls'
import AddStaff from '../../../../svgs/AddStaff'
import Dots from '../../../../svgs/Dots'
import RoundArrow from '../../../../svgs/RoundArrow'
import Edit from '../../../../svgs/Edit'
import Close from '../../../../svgs/Close'
import Check from '../../../../svgs/Check'
import Delete from '../../../../svgs/Delete'
import CMSService from '../../../../api/services/CMSService'
import Loader from '../../../../utils/Loader'
import { withToast, handleSearchOnKeyPress } from '../../../../utils/helper'
import { AdDeleteSuccessMessage } from '../../../../utils/messages'
import Search from '../../../../svgs/Search'

const BannerAdList = (props) => {
  const { fetchBannerAdDetails, loading, addToast } = props
  const history = useHistory()
  const [searchValue, setSearchValue] = useState(null)
  const [showAction, setShowAction] = useState(false)
  const [adsData, setAdsData] = useState([])
  const [totalPages, setTotalPages] = useState(1)
  const [currentPage, setCurrentPage] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [showReject, setShowReject] = useState(false)
  const [showDelete, setShowDelete] = useState(false)
  const [showApprove, setShowApprove] = useState(false)
  const [startStop, setStartStop] = useState(false)
  const [type, setType] = useState('')

  const [item, setItem] = useState('')
  const [key, setKey] = useState('')
  const roles = ['systemAdmin', 'systemManager']
  const rejectBanner = (status, id = null, key = null) => {
    setItem(id)
    setKey(key)
    setShowAction(false)
    setShowReject(status)
  }
  const approveBanner = (status, id = null, key = null) => {
    setItem(id)
    setKey(key)
    setShowAction(false)
    setShowApprove(status)
  }
  const startStopBanner = (status, id = null, type = null, key = null) => {
    setType(type)
    setItem(id)
    setKey(key)
    setStartStop(status)
  }
  const deleteBanner = (status, id = null, key = null) => {
    setItem(id)
    setKey(key)
    setShowDelete(status)
  }

  useEffect(() => {
    window.addEventListener('keydown', handleSearchOnKeyPress)
    return () => window.removeEventListener('keydown', handleSearchOnKeyPress)
  }, [])

  const fetchBannerAds = async (
    fromStatus = null,
    id = null,
    key = null,
    search = null,
    pageNo = null
  ) => {
    let page
    let queryString = ''
    let currPage = 1
    if (fromStatus !== 'fromDelete') {
      currPage = currentPage
    }
    if (key || key === 0) {
      page = key === 0 ? 1 : Math.ceil(key / 8)
      queryString = `?page=${pageNo || page}&limit=9${
        search ? `&search=${search}` : ''
      }`
    } else {
      queryString = `?page=${pageNo || currPage}&limit=9${
        search ? `&search=${search}` : ''
      }`
    }
    setIsLoading(true)
    try {
      const response = await CMSService.fetchBannerAds(queryString)
      if (fromStatus && id) {
        const updatedData = response?.ads.filter((item) => item.id === id)
        setAdsData(
          adsData.map((item) => (item.id === id ? updatedData[0] : item))
        )
        // setAdsData(response?.ads)
      } else if (fromStatus === 'fromDelete') {
        setAdsData(response?.ads)
      } else if (search) {
        if (pageNo > 1 || page > 1 || currPage > 1) {
          setAdsData([...adsData, ...response?.ads])
        } else {
          setAdsData(response?.ads)
        }
      } else if (search === '') {
        setAdsData(response?.ads)
      } else {
        setAdsData([...adsData, ...response?.ads])
      }
      setTotalPages(response?.totalPages)

      setIsLoading(false)
    } catch (e) {
      console.warn('banner ads List:', e)

      setIsLoading(false)
    }
  }
  useEffect(() => {
    fetchBannerAds(null, null, null, searchValue, null)
  }, [currentPage])
  const updateBannerStatus = async (id, status, key) => {
    try {
      setIsLoading(true)
      const queryParam = `/${id}`
      const data = {
        type: status,
      }
      const message =
        status === 'start'
          ? 'Banner ad started  successfully'
          : status === 'stop'
          ? 'Banner ad stopped  successfully'
          : status === 'approved'
          ? 'Banner ad approved'
          : status === 'unapproved'
          ? 'Banner ad rejected'
          : ''

      const response = await CMSService.updateBannerStatus(data, queryParam)
      if (response.length) {
        addToast(response[0].message, { appearance: 'error' })
      } else {
        addToast(message, { appearance: 'success' })
        fetchBannerAds(true, id, key)
        history.push('/admin/cms/banner')
      }
      setIsLoading(false)
      setShowApprove(false)
      setShowReject(false)
      setStartStop(false)
      setShowDelete(false)
    } catch (error) {
      console.warn('Update banner(updatebannerOnSubmit):', error)
      setIsLoading(false)
    }
  }
  const deleteBannerDetail = async (id) => {
    try {
      setIsLoading(true)
      const queryParam = `/${id}`

      const response = await CMSService.deleteBannerAd(queryParam)
      if (response.length) {
        addToast(response[0].message, { appearance: 'error' })
      } else {
        setCurrentPage(1)
        addToast(AdDeleteSuccessMessage, { appearance: 'success' })
        fetchBannerAds('fromDelete')
        history.push('/admin/cms/banner')
      }
      setIsLoading(false)
      setShowApprove(false)
      setShowReject(false)
      setShowDelete(false)
      setStartStop(false)
    } catch (error) {
      console.warn('Update banner(updatebannerOnSubmit):', error)
      setIsLoading(false)
    }
  }
  const handlePagination = () => {
    setCurrentPage(currentPage + 1)
  }

  const updateBannerAd = (id) => {
    fetchBannerAdDetails(id)

    history.push(`${url.bannerUpdate}?id=${id}`)
  }

  const handleActionOpen = (status) => {
    setShowAction(status)
  }

  const handleSearch = (e) => {
    const pageNo = e.target.value ? 1 : null
    if (pageNo) {
      setCurrentPage(pageNo)
    } else {
      setCurrentPage(1)
      setAdsData([])
    }
    setSearchValue(e.target.value ? e.target.value : null)
    fetchBannerAds(null, null, null, e.target.value, pageNo)
  }

  return (
    <div className="banner-list-page">
      {(isLoading || loading) && <Loader className="screen-centered" />}

      <div className="page-header">
        <div className="page-left-header">
          <Header as="h1">Banner Ad</Header>
          <div className="date">
            <span> {`${dayjs().format('dddd')}`}, </span>{' '}
            {`${dayjs().format('D MMMM YYYY')}`}
          </div>
        </div>
        <div className="page-right-header">
          <Input
            iconPosition="left"
            onBlur={(e) => e.target.value && handleSearch(e)}
            placeholder="Search"
            className="blurOnEnter"
            onChange={(e) => !e.target.value && handleSearch(e)}
          >
            <Search />
            <input maxLength="255" />
          </Input>
        </div>
      </div>

      <Grid className="banner-list-wrapper">
        <Grid.Column>
          <Link className="create-banner-card" to={url.bannerCreate}>
            <span className="icon-wrapper">
              <AddStaff />
            </span>
            <span className="text">
              Create new
              <br />
              advertisement
            </span>
          </Link>
        </Grid.Column>
        {adsData?.map((detail, key) => (
          <Grid.Column>
            <div className="banner-card">
              <img
                className="banner-image"
                src={detail.mobileImage}
                alt={detail.metaData}
              />
              <div className="banner-card-inner">
                {detail.url ? (
                  <a
                    href="https://www.google.com"
                    className="banner-link"
                    target="_blank"
                    rel="noreferrer"
                    // rel="noreferrer"
                  >
                    &nbsp;
                  </a>
                ) : (
                  ''
                )}

                <div className="name">{detail.name}</div>
                <div className="impression">{`${detail.impression} impressions`}</div>
                <div className="location">
                  <span className="value">CTR</span>
                  <span className="dot">-</span>
                  <span>
                    {!Number.isInteger(detail.ctr)
                      ? detail.ctr.toFixed(2)
                      : detail.ctr}
                  </span>
                </div>
                {roles.includes(localStorage.getItem('role')) &&
                  (!detail.isPending ? (
                    <div className="btn-wrapper">
                      {detail.isApprove && (
                        <>
                          <Button
                            className="edit"
                            onClick={() => updateBannerAd(detail.id)}
                            onKeyDown={() => updateBannerAd(detail.id)}
                          >
                            <Edit />
                            Edit
                          </Button>
                          {detail.status ? (
                            <Button
                              className="stop"
                              onClick={() =>
                                startStopBanner(true, detail.id, 'stop', key)
                              }
                              onKeyDown={() =>
                                startStopBanner(true, detail.id, 'stop', key)
                              }
                            >
                              <span className="icon-wrapper">
                                <span className="circle" />
                              </span>
                              Stop
                            </Button>
                          ) : (
                            <Button
                              className="start"
                              onClick={() =>
                                startStopBanner(true, detail.id, 'start', key)
                              }
                              onKeyDown={() =>
                                startStopBanner(true, detail.id, 'start', key)
                              }
                            >
                              <Check />
                              Start
                            </Button>
                          )}
                        </>
                      )}
                      <Button
                        className="delete"
                        onClick={() => deleteBanner(true, detail.id, key)}
                        onKeyDown={() => deleteBanner(true, detail.id, key)}
                      >
                        <Close />
                        Delete
                      </Button>
                    </div>
                  ) : (
                    <div className="btn-wrapper">
                      <Button
                        className="edit"
                        onClick={() => updateBannerAd(detail.id)}
                        onKeyDown={() => updateBannerAd(detail.id)}
                      >
                        <Edit />
                        Edit
                      </Button>
                      <Button
                        className="delete"
                        onClick={() => deleteBanner(true, detail.id, key)}
                        onKeyDown={() => deleteBanner(true, detail.id, key)}
                      >
                        <Close />
                        Delete
                      </Button>
                    </div>
                  ))}
                {detail.isPending &&
                roles.includes(localStorage.getItem('role')) ? (
                  <Popup
                    className="action-popup banner-popup"
                    on="click"
                    open={showAction}
                    onOpen={() => handleActionOpen(this, true)}
                    onClose={() => handleActionOpen(this, false)}
                    pinned
                    position="bottom right"
                    trigger={
                      <div className="dots-action actions">
                        <Dots />
                      </div>
                    }
                  >
                    <div className="action-dropdown">
                      <ul>
                        <li>
                          <div
                            onClick={() => approveBanner(true, detail.id, key)}
                            onKeyDown={() =>
                              approveBanner(true, detail.id, key)
                            }
                          >
                            Approve
                          </div>
                        </li>
                        <li>
                          <div
                            onClick={() => rejectBanner(true, detail.id, key)}
                            onKeyDown={() => rejectBanner(true, detail.id, key)}
                          >
                            Reject
                          </div>
                        </li>
                      </ul>
                    </div>
                  </Popup>
                ) : !detail.isPending && detail.isApprove ? (
                  <div className="dots-action">
                    <div className="banner-status approved">
                      <Check />
                    </div>
                  </div>
                ) : !detail.isPending && !detail.isApprove ? (
                  <div className="dots-action">
                    <div className="banner-status rejected">
                      <Close />
                    </div>
                  </div>
                ) : (
                  ''
                )}
              </div>
            </div>
          </Grid.Column>
        ))}
      </Grid>
      {currentPage !== totalPages && totalPages !== 0 && (
        <div className="read-more-btn-wrapper">
          <Button onClick={handlePagination}>
            Show more
            <RoundArrow />
          </Button>
        </div>
      )}

      <Modal
        open={showReject}
        onClose={() => setShowReject(false)}
        onOpen={() => setShowReject(true)}
        className="create-segment-popup"
      >
        <Form>
          <Modal.Content>
            <div className="popupDeleteIcon">
              <Close />
            </div>
            <Header as="h2">Are you sure you want to reject banner ad?</Header>
          </Modal.Content>
          <Modal.Actions>
            <Button
              primary
              onClick={() => updateBannerStatus(item, 'unapproved', key)}
            >
              Yes
            </Button>
            <Button secondary onClick={() => rejectBanner(false)}>
              No
            </Button>
          </Modal.Actions>
        </Form>
      </Modal>

      <Modal
        open={showApprove}
        onClose={() => setShowApprove(false)}
        onOpen={() => setShowApprove(true)}
        className="create-segment-popup"
      >
        <Form>
          <Modal.Content>
            <div className="popupDeleteIcon">
              <Check />
            </div>
            <Header as="h2">Are you sure you want to approve banner ad?</Header>
          </Modal.Content>
          <Modal.Actions>
            <Button
              primary
              onClick={() => updateBannerStatus(item, 'approved', key)}
            >
              Yes
            </Button>
            <Button secondary onClick={() => approveBanner(false)}>
              No
            </Button>
          </Modal.Actions>
        </Form>
      </Modal>
      <Modal
        open={showDelete}
        onClose={() => setShowDelete(false)}
        onOpen={() => setShowDelete(true)}
        className="create-segment-popup"
      >
        <Form>
          <Modal.Content>
            <div className="popupDeleteIcon">
              <Delete />
            </div>
            <Header as="h2">Are you sure you want to delete banner ad?</Header>
          </Modal.Content>
          <Modal.Actions>
            <Button primary onClick={() => deleteBannerDetail(item)}>
              Yes
            </Button>
            <Button secondary onClick={() => deleteBanner(false)}>
              No
            </Button>
          </Modal.Actions>
        </Form>
      </Modal>
      <Modal
        open={startStop}
        onClose={() => setStartStop(false)}
        onOpen={() => setStartStop(true)}
        className="create-segment-popup"
      >
        <Form>
          <Modal.Content>
            <div className="popupDeleteIcon">
              {type === 'start' ? (
                <Check />
              ) : (
                <div className="icon-wrapper">
                  <span className="circle" />
                </div>
              )}
            </div>
            <Header as="h2">
              {`The banner ad will ${
                type === 'stop' ? 'not' : ''
              } be available to the consumers. Are you sure you want to ${type} this?`}
            </Header>
          </Modal.Content>
          <Modal.Actions>
            <Button primary onClick={() => updateBannerStatus(item, type, key)}>
              Yes
            </Button>
            <Button secondary onClick={() => startStopBanner(false)}>
              No
            </Button>
          </Modal.Actions>
        </Form>
      </Modal>
    </div>
  )
}

export default withToast(BannerAdList)
BannerAdList.propTypes = {
  fetchBannerAdDetails: propTypes.func.isRequired,
  loading: propTypes.bool.isRequired,
  addToast: propTypes.func.isRequired,
}
