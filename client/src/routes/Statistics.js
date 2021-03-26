import React from 'react'
import { useRoute } from 'wouter'
import Statistics from 'components/Statistics'

const StatisticsRoute = (props) => {
  const [match] = useRoute('/:ticker/statistics')
  return match ? <Statistics {...props} /> : null
}

export default StatisticsRoute
