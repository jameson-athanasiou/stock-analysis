import React, { useMemo } from 'react'
import PropTypes from 'prop-types'
import { isEmpty } from 'lodash'
import { FIELDS } from 'constants'
import Chart from 'components/Chart'

const {
  FREE_CASH_FLOW,
  NET_INCOME,
  OPERATING_CASH_FLOW,
  REVENUE,
  RETURN_ON_ASSETS,
  RETURN_ON_EQUITY,
  RETURN_ON_INVESTED_CAPITAL,
} = FIELDS

const formatData = (data, fields) =>
  Object.keys(data[fields[0]] || {})
    .filter((year) => year !== 'TTM')
    .map((year) => ({
      year,
      ...fields.reduce((acc, curr) => ({ ...acc, [curr]: data[curr][year] }), {}),
    }))

const Trends = ({ data, loading }) => {
  console.log(data)
  if (loading || isEmpty(data)) return null

  const charts = [
    { dataPoints: [FREE_CASH_FLOW, NET_INCOME, OPERATING_CASH_FLOW], title: 'Summary' },
    { dataPoints: [RETURN_ON_ASSETS, RETURN_ON_EQUITY, RETURN_ON_INVESTED_CAPITAL], title: 'Return on X' },
  ]

  const compliedChartData = charts.map(({ dataPoints, title }) => ({
    data: useMemo(() => formatData(data, dataPoints), [loading]),
    dataPoints,
    title,
  }))

  return compliedChartData.map(({ data: chartData, dataPoints, title }) => (
    <Chart data={chartData} dataPoints={dataPoints} key={title} />
  ))
}

export default Trends
