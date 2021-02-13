import React, { useMemo } from 'react'
import PropTypes from 'prop-types'
import { isEmpty } from 'lodash'
import { FIELDS } from 'constants'
import { Divider, Typography } from 'antd'
import Chart from 'components/Chart'

const { Title } = Typography

const {
  BOOK_VALUE_PER_SHARE,
  EARNINGS_PER_SHARE,
  FREE_CASH_FLOW,
  FREE_CASH_FLOW_PER_SHARE,
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
    { dataPoints: [BOOK_VALUE_PER_SHARE, EARNINGS_PER_SHARE, FREE_CASH_FLOW_PER_SHARE], title: 'Per Share Values' },
    { dataPoints: [RETURN_ON_ASSETS, RETURN_ON_EQUITY, RETURN_ON_INVESTED_CAPITAL], title: 'Return on X' },
  ]

  const compliedChartData = charts.map(({ dataPoints, title }) => ({
    data: useMemo(() => formatData(data, dataPoints), [loading]),
    dataPoints,
    title,
  }))

  return compliedChartData.map(({ data: chartData, dataPoints, title }, index) => (
    <>
      {index ? <Divider /> : null}
      <Title level={2}>{title}</Title>
      <Chart data={chartData} dataPoints={dataPoints} key={title} />
    </>
  ))
}

export default Trends
