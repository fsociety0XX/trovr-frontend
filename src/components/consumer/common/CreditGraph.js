import React from 'react'
import propTypes from 'prop-types'
import GreenTrophy from '../../../svgs/GreenTrophy'
import { convertNumberWithKInLast } from '../../../utils/helper'

const CreditGraph = (props) => {
  const { spentPoints, totalEarnedPoints } = props
  const totalCredit = totalEarnedPoints
  const spentCredit = spentPoints
  const remainCredit = totalCredit - spentCredit
  const spentCreditPer = (spentCredit * 100) / totalCredit
  const degree = 180 - spentCreditPer * 1.8
  const remainDegree = degree - 180
  const creditCounterDegree = (degree / 2 + 45) * -1
  const reaminCreditCounterDegree = (degree / 2 - 45) * -1

  return (
    <div className="credits-wrapper credit-graph-block">
      <div className="header-segment clearfix">
        <div className="header-title">
          <div className="title">Credits</div>
        </div>
      </div>

      <div className="cards-content credits-content a-center">
        <div className="credit-graph-section">
          <div className="credit-graph-section-inner">
            {spentCredit > 0 ? (
              <div
                className="creditCount-wrapper"
                style={{
                  transform: `rotate(${creditCounterDegree}deg) scaleX(-1)`,
                }}
              >
                <div
                  className="spentCredit creditCount"
                  style={{
                    transform: `rotate(${creditCounterDegree}deg)  scaleX(-1)`,
                  }}
                >
                  {convertNumberWithKInLast(spentCredit)}
                </div>
              </div>
            ) : (
              ''
            )}
            {remainCredit > 0 ? (
              <div
                className="creditCount-wrapper"
                style={{
                  transform: `rotate(${reaminCreditCounterDegree}deg) scaleX(-1)`,
                }}
              >
                <div
                  className="spentCredit creditCount remain-credit"
                  style={{
                    transform: `rotate(${reaminCreditCounterDegree}deg)  scaleX(-1)`,
                  }}
                >
                  {convertNumberWithKInLast(remainCredit)}
                </div>
              </div>
            ) : (
              ''
            )}
            <div className="credit-graph-wrapper">
              <div
                className="spent-rewards-graph"
                style={{ transform: `rotate(${degree}deg)` }}
              >
                <div className="spent-rewards-graph-inner" />
              </div>
              <div
                className="spent-rewards-graph remain"
                style={{ transform: `rotate(${remainDegree}deg)` }}
              >
                <div className="spent-rewards-graph-inner" />
              </div>
            </div>
            <div className="earned-rewards">Total Earned Rewards</div>
            <div className="spent-analysis a-center">
              <GreenTrophy />
              {convertNumberWithKInLast(totalCredit)}
            </div>
            <div className="credit-graph-legends-wrapper">
              <div className="credit-graph-legend">Spent</div>
              <div className="credit-graph-legend remain">Remaining</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

CreditGraph.propTypes = {
  spentPoints: propTypes.number.isRequired,
  totalEarnedPoints: propTypes.number.isRequired,
}

export default CreditGraph
