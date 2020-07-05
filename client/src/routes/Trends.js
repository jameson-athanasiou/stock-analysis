import React from 'react'
import { useRoute } from 'wouter'
import Trends from 'components/Trends'

const TrendsRoute = (props) => {
  const [match] = useRoute('/:ticker/trends')
  return match ? <Trends {...props} /> : null
}

export default TrendsRoute
