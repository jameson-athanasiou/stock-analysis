import React, { useMemo } from 'react'
import PropTypes from 'prop-types'
import { isEmpty } from 'lodash'
import { FIELDS } from 'constants'
import Chart from 'components/Chart'

const { FREE_CASH_FLOW, NET_INCOME, OPERATING_CASH_FLOW, REVENUE } = FIELDS

const Trends = ({ data, loading }) => {
  console.log(data)
  if (loading || isEmpty(data)) return null

  const dataPoints = [FREE_CASH_FLOW, NET_INCOME, REVENUE, OPERATING_CASH_FLOW]
  const chartData = useMemo(
    () =>
      Object.keys(data[dataPoints[0]] || {})
        .filter((year) => year !== 'TTM')
        .map((year) => ({
          year,
          [REVENUE]: data[REVENUE][year],
          [NET_INCOME]: data[NET_INCOME][year],
          [FREE_CASH_FLOW]: data[FREE_CASH_FLOW][year],
          [OPERATING_CASH_FLOW]: data[OPERATING_CASH_FLOW][year],
        })),
    [loading]
  )

  console.log(chartData)

  return <Chart data={chartData} dataPoints={dataPoints} />
}

export default Trends
