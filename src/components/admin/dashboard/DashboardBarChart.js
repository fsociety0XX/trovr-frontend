import React from 'react'
import propTypes from 'prop-types'
import { Dropdown } from 'semantic-ui-react'
import { Bar } from 'react-chartjs-2'

const DashboardBarChart = (props) => {
  const {
    title,
    dropdownOptions,
    chartData,
    xAxesLabel,
    yAxesLabel,
    handleChartFilterChange,
  } = props

  const legend = {
    display: false,
    position: 'bottom',
    labels: {
      fontColor: '#434C51',
      fontSize: 14,
    },
  }

  const options = {
    scales: {
      yAxes: [
        {
          ticks: {
            suggestedMin: 0,
            suggestedMax: 100,
          },
          gridLines: {
            color: '#EDEDE8',
            borderColor: 'yellow',
            tickColor: '#EDEDE8',
            drawBorder: 'rgba(0, 0, 0, 0)',
          },
          scaleLabel: {
            display: true,
            labelString: yAxesLabel,
          },
        },
      ],
      xAxes: [
        {
          barPercentage: 0.8,
          ticks: {
            suggestedMin: 0,
            suggestedMax: 100,
          },
          gridLines: {
            color: 'rgba(0, 0, 0, 0)',
          },
          scaleLabel: {
            display: true,
            labelString: xAxesLabel,
          },
        },
      ],
    },
  }

  const handleFilterChange = (e, { value }) => {
    handleChartFilterChange(title, value)
  }

  return (
    <>
      <div className="header-with-filter">
        <div className="title">{title}</div>
        <Dropdown
          options={dropdownOptions}
          placeholder="last week"
          fluid
          selection
          onChange={handleFilterChange}
        />
      </div>
      <div className="card-content">
        <Bar data={chartData} legend={legend} options={options} />
      </div>
    </>
  )
}
DashboardBarChart.propTypes = {
  title: propTypes.string.isRequired,
}

DashboardBarChart.propTypes = {
  dropdownOptions: propTypes.objectOf(propTypes.object).isRequired,
  chartData: propTypes.arrayOf(propTypes.array).isRequired,
  xAxesLabel: propTypes.string.isRequired,
  yAxesLabel: propTypes.string.isRequired,
  handleChartFilterChange: propTypes.func.isRequired,
}

export default DashboardBarChart
