import React from 'react'
import propTypes from 'prop-types'
import { Container } from 'semantic-ui-react'
import 'react-responsive-carousel/lib/styles/carousel.min.css' // requires a loader
import { Carousel } from 'react-responsive-carousel'
import DashboardService from '../../../api/services/DashboardService'

// if same advertisement layout will be used in multiple place than we will move this componenet from here and put it in common place
const Advertisement = (props) => {
  const { bannerList } = props

  const getAdsImpression = async (data) => {
    try {
      await DashboardService.adsImpression(data)
    } catch (err) {
      console.warn('Consumer Dashboard(getAdsImpression):', err)
    }
  }

  const handleBannerOnChange = (index, item) => {
    const { id } = item.props
    const data = {
      adId: id,
      type: 'view',
    }
    getAdsImpression(data)
  }

  const handleBannerOnClick = (index, item) => {
    const { id } = item.props
    const data = {
      adId: id,
      type: 'click',
    }
    getAdsImpression(data)
  }

  return (
    <>
      <Container className="a-center trovr-ad-box">
        <Carousel
          autoPlay
          showThumbs={false}
          showArrows={false}
          showStatus={false}
          infiniteLoop
          swipeable
          onChange={handleBannerOnChange}
          onClickItem={handleBannerOnClick}
        >
          {bannerList?.map((data) => (
            <a href={data.url} target="_blank" id={data.id} rel="noreferrer">
              <img className="desktop-banner" src={data.webImage} alt="slide" />
              <img
                className="mobile-banner"
                src={data.mobileImage}
                alt="slide"
              />
            </a>
          ))}
        </Carousel>
      </Container>
    </>
  )
}

Advertisement.propTypes = {
  bannerList: propTypes.objectOf(propTypes.object).isRequired,
}

export default Advertisement
