import React from 'react'
import { Select, Pagination, Icon } from 'semantic-ui-react'
import propTypes from 'prop-types'
import PagiLeftArrow from '../svgs/PagiLeftArrow'
import PagiRightArrow from '../svgs/PagiRightArrow'

const paginationOption = [
  {
    key: '15',
    value: 15,
    text: '15',
  },
  {
    key: '50',
    value: 50,
    text: '50',
  },
  {
    key: '100',
    value: 100,
    text: '100',
  },
]

const CustomPagination = (props) => {
  const { limit, totalPages, currentPage, handlePagination } = props
  const handleRowCountChange = (event, data) => {
    if (data.value !== limit) {
      handlePagination(1, data.value)
    }
  }

  const handlePaginationChange = (event, data) => {
    handlePagination(data.activePage, limit)
  }

  return (
    <div className="pagination">
      <div className="pagination-select">
        <span>Show </span>
        <Select
          selection
          options={paginationOption}
          onChange={(event, data) => handleRowCountChange(event, data)}
          value={limit}
        />
        <span>Entries</span>
      </div>
      <div
        className={`pagination-action ${
          totalPages <= 1 ? 'disable-pagination' : ''
        }`}
      >
        <Pagination
          activePage={currentPage}
          ellipsisItem={{
            content: <Icon name="ellipsis horizontal" />,
            icon: true,
          }}
          firstItem={{
            content: <PagiLeftArrow />,
            icon: true,
            disabled: currentPage === 1,
          }}
          lastItem={{
            content: <PagiRightArrow />,
            icon: true,
            disabled: currentPage === totalPages,
          }}
          prevItem={{
            content: 'Prev',
            disabled: currentPage === 1,
          }}
          nextItem={{
            content: 'Next',
            disabled: currentPage === totalPages,
          }}
          onPageChange={handlePaginationChange}
          totalPages={totalPages}
        />
      </div>
    </div>
  )
}

export default CustomPagination

CustomPagination.propTypes = {
  limit: propTypes.number.isRequired,
  handlePagination: propTypes.func.isRequired,
  totalPages: propTypes.number.isRequired,
  currentPage: propTypes.number.isRequired,
}
