import React, { Component } from 'react'
import { Header } from 'semantic-ui-react'
import dayjs from 'dayjs'
import CreateSegment from './CreateSegment'
import SegmentList from './SegmentList'

class index extends Component {
  constructor(props) {
    super(props)
    this.state = {
      callSegmentList: false,
    }
  }

  callSegmentListFunc = () => {
    const { callSegmentList } = this.state

    this.setState({
      callSegmentList: !callSegmentList,
    })
  }

  render() {
    const { callSegmentList } = this.state

    return (
      <div className="segment-list-page">
        <div className="page-header">
          <div className="page-left-header">
            <Header as="h1">Segments</Header>
            <div className="date">
              <span> {`${dayjs().format('dddd')}`}, </span>{' '}
              {`${dayjs().format('D MMMM YYYY')}`}
            </div>
          </div>
          <div className="page-right-header">
            <CreateSegment
              segment
              callSegmentListFunc={this.callSegmentListFunc}
            />
          </div>
        </div>
        <SegmentList callSegmentList={callSegmentList} />
      </div>
    )
  }
}

export default index
