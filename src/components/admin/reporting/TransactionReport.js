import React, { Component } from 'react'
import {
  Header,
  Table,
  Form,
  Button,
  Dropdown,
  Modal,
  Grid,
  Checkbox,
  Input,
  Select,
  Popup,
} from 'semantic-ui-react'
import dayjs from 'dayjs'
// import propTypes from 'prop-types'
import PerfectScrollbar from 'react-perfect-scrollbar'
import { DatesRangeInput } from 'semantic-ui-calendar-react'
import CustomPagination from '../../../utils/customPagination'
import ArrowRight from '../../../svgs/ArrowRight'
import { withToast, renderFieldError } from '../../../utils/helper'
import Calendar from '../../../svgs/Calendar'
import Download from '../../../svgs/Download'
import Postcode from '../../../svgs/Postcode'
import Search from '../../../svgs/Search'
import * as placeholder from '../../../utils/placeholders'
import Merchant from '../../../svgs/Merchant'
import SearchFilter from '../../../svgs/SearchFilter'
import PieChart from '../../../svgs/PieChart'

const errors = {}
//   const [errors, setErrors] = useState({})
const currentPage = 1
// const [currentPage, setCurrentPage] = useState(1)
const limit = 15
// const [limit, setLimit] = useState(15)
const totalPages = 1
// const [totalPages, setTotalPages] = useState(1)

const handlePagination = () => {}

const downloadFileOptions = [
  { key: 'csv', value: 'csv', text: 'CSV' },
  { key: 'pdf', value: 'pdf', text: 'PDF' },
]

const segmentOptions = [
  { key: 'Free', value: 'free', text: 'Free' },
  { key: 'Money off', value: 'moneyOff', text: 'Money off' },
  { key: 'Percentage off', value: 'percentageOff', text: 'Percentage off' },
]

const merchantOptions = [
  { key: 'Free', value: 'free', text: 'Free' },
  { key: 'Money off', value: 'moneyOff', text: 'Money off' },
  { key: 'Percentage off', value: 'percentageOff', text: 'Percentage off' },
]

class TransactionReport extends Component {
  constructor(props) {
    super(props)
    this.state = {
      date: '',
      filterPopup: false,
    }
  }

  handleChange = (event, { value }) => {
    this.setState({
      date: value,
    })
  }

  handleFilter = (status) => {
    this.setState({
      filterPopup: status,
    })
  }

  tableRows = () => {
    const { date } = this.state
    return (
      <>
        <div className="page-header">
          <div className="page-left-header">
            <Header as="h1">Transaction Report</Header>
            <div className="date">
              <span> {`${dayjs().format('dddd')}`}, </span>{' '}
              {`${dayjs().format('D MMMM YYYY')}`}
            </div>
          </div>
          <div className="page-right-header">
            <Input
              iconPosition="left"
              // onChange={handleSearch}
              placeholder="Search"
              // value={searchValue}
              className="search-box"
            >
              <Search />
              <input maxLength="255" />
            </Input>
            <div className="calendar-fields">
              <Form.Field>
                <div className="ui left icon input calendar">
                  <Calendar />

                  <DatesRangeInput
                    name="datesRange"
                    placeholder="From - To"
                    value={date}
                    iconPosition="left"
                    onChange={this.handleChange}
                    autoComplete="off"
                  />
                </div>
                {renderFieldError([...(errors.dob || [])])}
              </Form.Field>
              <div
                onKeyDown={() => this.handleFilter(true)}
                onClick={() => this.handleFilter(true)}
                className="only-filter-wrapper"
              >
                <SearchFilter /> Filter
              </div>
            </div>
            <Button primary className="arrow-button">
              <ArrowRight />
            </Button>
          </div>
        </div>

        <div className="table-wrapper">
          <PerfectScrollbar>
            <Table sortable singleLine>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell className="sortable">User</Table.HeaderCell>
                  <Table.HeaderCell className="sortable">
                    Email
                  </Table.HeaderCell>
                  <Table.HeaderCell className="sortable">
                    User Type
                  </Table.HeaderCell>
                  <Table.HeaderCell className="sortable">
                    Product Name
                  </Table.HeaderCell>
                  <Table.HeaderCell className="sortable">
                    Segment Type
                  </Table.HeaderCell>
                  <Table.HeaderCell className="sortable">
                    Timestamp
                  </Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                <Table.Row>
                  <Table.Cell data-label="User">Simon Morton</Table.Cell>
                  <Table.Cell data-label="Email">simon@trovr.com</Table.Cell>
                  <Table.Cell data-label="User Type">
                    <Popup
                      className="tooltip"
                      pinned
                      position="bottom center"
                      trigger={
                        <div className="icon">
                          <Merchant />
                        </div>
                      }
                    >
                      <div className="icon-tooltip">Merchant</div>
                    </Popup>
                  </Table.Cell>
                  <Table.Cell data-label="Product Name">Lorem Ipsum</Table.Cell>
                  <Table.Cell data-label="Segment Type">
                    <div className="table-segment-data">Lorem Ipsum</div>
                  </Table.Cell>
                  <Table.Cell data-label="Timestamp">
                    19/03/21 - 05:30 AM
                  </Table.Cell>
                </Table.Row>{' '}
                <Table.Row>
                  <Table.Cell data-label="User">Simon Morton</Table.Cell>
                  <Table.Cell data-label="Email">simon@trovr.com</Table.Cell>
                  <Table.Cell data-label="User Type">
                    <Popup
                      className="tooltip"
                      pinned
                      position="bottom center"
                      trigger={
                        <div className="icon">
                          <Merchant />
                        </div>
                      }
                    >
                      <div className="icon-tooltip">Merchant</div>
                    </Popup>
                  </Table.Cell>
                  <Table.Cell data-label="Product Name">Lorem Ipsum</Table.Cell>
                  <Table.Cell data-label="Segment Type">
                    <div className="table-segment-data">Lorem Ipsum</div>
                  </Table.Cell>
                  <Table.Cell data-label="Timestamp">
                    19/03/21 - 05:30 AM
                  </Table.Cell>
                </Table.Row>
              </Table.Body>
            </Table>
          </PerfectScrollbar>
        </div>
        <div className="bottom-actions-wrapper with-export-btn">
          <div className="export-dropdown-wrapper">
            <div className="ui right icon select">
              <Dropdown
                text={placeholder.exportLabel}
                name="consumerHistroyArray"
                // value={segmentArray}
                fluid
                selection
                options={downloadFileOptions}
                // onChange={handleChange}
              />
              <Download />
            </div>
          </div>
          <div className="pagination-wrapper">
            <CustomPagination
              handlePagination={handlePagination}
              currentPage={currentPage}
              limit={limit}
              totalPages={totalPages}
            />
          </div>
        </div>
      </>
    )
  }

  render() {
    const { filterPopup } = this.state
    return (
      <div className="transection-report-page">
        {this.tableRows()}
        <Modal open={filterPopup} className="multiple-filter-popup">
          <Modal.Header className="a-center">
            Filter Transaction Report by
          </Modal.Header>
          <Modal.Content>
            <Grid columns={2}>
              <Grid.Column>
                <Form.Field className="checbox-field">
                  <Checkbox
                    label="Proximity"
                    name="proximity"
                    //    checked={proximity}
                    //  onChange={handleChange}
                  />
                </Form.Field>
                <Form.Field>
                  <Input
                    iconPosition="left"
                    placeholder={placeholder.postcode}
                    name="postcode"
                    // value={!postcode && postcode !== '' ? postalCode : postcode}
                    //   onChange={handleChange}
                    minLength="1"
                    maxLength="10"
                  >
                    <Postcode />
                    <input />
                  </Input>
                  {
                    // renderFieldError([...(errors.postcode || [])])
                  }
                </Form.Field>
              </Grid.Column>
              <Grid.Column>
                <Form.Field className="checbox-field">
                  <Checkbox
                    name="rewardType"
                    label="Voucher Type"
                    //        checked={rewardType}
                    //      onChange={handleChange}
                  />
                </Form.Field>
                <Form.Field className="radio-buttons-wrapper">
                  <Checkbox
                    name="freeRadioBtn"
                    className="rewards-radio-button"
                    label="Free"
                    //       checked={freeRadioBtn}
                    //     onChange={handleChange}
                  />

                  <Checkbox
                    className="rewards-radio-button"
                    name="moneyOffRadioBtn"
                    label="Money off"
                    //  onChange={handleChange}
                    // checked={moneyOffRadioBtn}
                  />

                  <Checkbox
                    className="rewards-radio-button"
                    name="lessThanFiftyPercent"
                    label="0%-50% off"
                    //    onChange={handleChange}
                    //  checked={lessThanFiftyPercent}
                  />

                  <Checkbox
                    className="rewards-radio-button"
                    name="moreThanFiftyPercent"
                    label="50%-100% off"
                    //        onChange={handleChange}
                    //      checked={moreThanFiftyPercent}
                  />
                </Form.Field>
              </Grid.Column>
              <Grid.Column>
                <Form.Field className="checbox-field">
                  <Checkbox
                    name="segments"
                    label="Segment"
                    //   checked={soonToExpire}
                    // onChange={handleChange}
                  />
                </Form.Field>
                <Form.Field>
                  <div className="ui left icon select">
                    <Select
                      placeholder={placeholder.segmentName}
                      options={segmentOptions}
                      name="segment"
                      // value={country || ''}
                      // onChange={handleChange}
                      // disabled={disableMerchantFields}
                    />
                    <PieChart />
                  </div>
                </Form.Field>
              </Grid.Column>

              <Grid.Column>
                <Form.Field className="checbox-field">
                  <Checkbox
                    name="merchants"
                    label="Merchant"
                    //   checked={soonToExpire}
                    // onChange={handleChange}
                  />
                </Form.Field>
                <Form.Field>
                  <div className="ui left icon select">
                    <Select
                      placeholder={placeholder.selectMerchants}
                      options={merchantOptions}
                      name="merchant"
                      // value={country || ''}
                      // onChange={handleChange}
                      // disabled={disableMerchantFields}
                    />
                    <Merchant />
                  </div>
                </Form.Field>
              </Grid.Column>

              <Grid.Column>
                <Form.Field className="checbox-field">
                  <Checkbox
                    name="frequentlyUsed"
                    label="To and from date"
                    //  checked={frequentlyUsed}
                    //    onChange={handleChange}
                  />
                </Form.Field>

                <Form.Field>
                  <div className="ui left icon input calendar">
                    <Calendar />

                    <DatesRangeInput
                      name="datesRange"
                      placeholder="From - To"
                      //     value={date}
                      iconPosition="left"
                      onChange={this.handleChange}
                      autoComplete="off"
                    />
                  </div>
                  {renderFieldError([...(errors.dob || [])])}
                </Form.Field>
              </Grid.Column>
            </Grid>
          </Modal.Content>
          <Modal.Actions>
            <Button
              //    onClick={handleFilterRewardsForm}
              //    disabled={disableFilterFormBtn}
              primary
            >
              Show Results
            </Button>
            <Button
              // onClick={clearAndApplyFilter}
              basic
            >
              Clear & Apply filters
            </Button>
            <Button
              secondary
              onKeyDown={() => this.handleFilter(false)}
              onClick={() => this.handleFilter(false)}
            >
              Cancel
            </Button>
          </Modal.Actions>
        </Modal>
      </div>
    )
  }
}
export default withToast(TransactionReport)
