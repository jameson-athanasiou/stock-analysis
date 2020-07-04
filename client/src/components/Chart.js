import React from 'react'
import PropTypes from 'prop-types'
import { CartesianGrid, Label, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

const colors = ['3c78d8', 'a61c00', '6aa84f', 'a64d79', 'e69138', '45818e']

const Chart = ({ data, dataPoints }) => (
  <ResponsiveContainer height={500}>
    <LineChart data={data}>
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

Chart.propTypes = {
  data: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number]))),
}

export default Chart
