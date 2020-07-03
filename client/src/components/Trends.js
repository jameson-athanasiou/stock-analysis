import React, { useMemo } from 'react'
import { CartesianGrid, Label, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { FIELDS } from 'constants'

const { FREE_CASH_FLOW, NET_INCOME, OPERATING_CASH_FLOW, REVENUE } = FIELDS

const colors = ['3c78d8', 'a61c00', '6aa84f', 'a64d79', 'e69138', '45818e']

const Trends = ({ data, loading }) => {
  console.log(data)

  if (loading) return null

  const dataPoints = [FREE_CASH_FLOW, NET_INCOME, REVENUE, OPERATING_CASH_FLOW]
  const chartData = useMemo(
    () =>
      Object.keys(data[dataPoints[0]])
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

  return (
    <ResponsiveContainer height={500}>
      <LineChart data={chartData}>
        <CartesianGrid stroke="#f5f5f5" fill="#e6e6e6" />
        <Legend />
        {dataPoints.map((item, index) => (
          <Line key={item} type="monotone" dataKey={item} stroke={`#${colors[index]}`} />
        ))}
        <Tooltip trigger="click" />
        <XAxis dataKey="year" height={40}>
          <Label position="insideBottom" />
        </XAxis>
        <YAxis />
      </LineChart>
    </ResponsiveContainer>
  )
}

export default Trends
