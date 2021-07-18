import React from 'react'
import propTypes from 'prop-types'
import { Grid, Container } from 'semantic-ui-react'
import GreenTrophy from '../../../svgs/GreenTrophy'
import MoneyBag from '../../../svgs/MoneyBag'
import UpArrow from '../../../svgs/UpArrow'
import DownArrow from '../../../svgs/DownArrow'
import { convertNumberWithKInLast } from '../../../utils/helper'

const Card = (props) => {
  const { pointBalance, cashBalance, spentPoints, earnedCash } = props

  return (
    <>
      <Grid columns={2} stackable className="consumer-points-wrapper">
        <Grid.Row>
          <Grid.Column>
            <Container className="balance-container">
              <div className="balance">
                Points Balance
                <div className="amount">
                  <GreenTrophy /> {convertNumberWithKInLast(pointBalance)}
                </div>
              </div>
              <div className="balance-analysis">
                Spent
                <div className="amount">
                  <UpArrow />
                  {convertNumberWithKInLast(spentPoints)}
                </div>
              </div>
            </Container>
          </Grid.Column>
          <Grid.Column>
            <Container className="balance-container">
              <div className="balance">
                Cash Balance
                <div className="amount">
                  <MoneyBag /> {convertNumberWithKInLast(cashBalance)}
                  <span className="currency-symbol">€</span>{' '}
                </div>
              </div>
              <div className="balance-analysis">
                Earned
                <div className="amount">
                  <DownArrow />
                  {convertNumberWithKInLast(earnedCash)}
                  <span className="currency-symbol">€</span>{' '}
                </div>
              </div>
            </Container>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </>
  )
}

Card.propTypes = {
  cashBalance: propTypes.number.isRequired,
  pointBalance: propTypes.number.isRequired,
  spentPoints: propTypes.number.isRequired,
  earnedCash: propTypes.number.isRequired,
}

export default Card
