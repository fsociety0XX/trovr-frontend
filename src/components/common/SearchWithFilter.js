import React from 'react'
import _ from 'lodash'
import { Search } from 'semantic-ui-react'
import propTypes from 'prop-types'
import SearchFilter from '../../svgs/SearchFilter'
import * as placeholder from '../../utils/placeholders'

const initialState = {
  loading: false,
  results: [],
  value: '',
}

function exampleReducer(state, action) {
  switch (action.type) {
    case 'CLEAN_QUERY':
      return initialState
    case 'START_SEARCH':
      return { ...state, loading: true, value: action.query }
    case 'FINISH_SEARCH':
      return { ...state, loading: false, results: action.results }
    case 'UPDATE_SELECTION':
      return { ...state, value: action.selection }

    default:
      throw new Error()
  }
}

function SearchWithFilter(props) {
  const [state, dispatch] = React.useReducer(exampleReducer, initialState)
  const { loading, results, value } = state

  const timeoutRef = React.useRef()
  const handleSearchChange = React.useCallback((e, data) => {
    clearTimeout(timeoutRef.current)
    dispatch({ type: 'START_SEARCH', query: data.value })

    timeoutRef.current = setTimeout(() => {
      if (data.value.length === 0) {
        dispatch({ type: 'CLEAN_QUERY' })
        return
      }

      const re = new RegExp(_.escapeRegExp(data.value), 'i')
      const isMatch = (result) => re.test(result.title)
      dispatch({
        type: 'FINISH_SEARCH',
        results: _.filter(props.source, isMatch),
      })
    }, 300)
  }, [])
  React.useEffect(
    () => () => {
      clearTimeout(timeoutRef.current)
    },
    []
  )

  return (
    <div className="search-with-filter">
      <Search
        loading={loading}
        onResultSelect={(e, data) =>
          dispatch({ type: 'UPDATE_SELECTION', selection: data.result.title })
        }
        onSearchChange={handleSearchChange}
        results={results}
        value={value}
        placeholder={placeholder.search}
      />
      <div className="search-filter-wrapper">
        <SearchFilter />
      </div>
    </div>
  )
}

SearchWithFilter.propTypes = {
  source: propTypes.objectOf(propTypes.object).isRequired,
}

export default SearchWithFilter
