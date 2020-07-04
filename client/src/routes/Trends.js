import React from 'react'
import { useRoute } from 'wouter'
import Trends from 'components/Trends'

const TrendsRoute = (props) => {
  const [match, params] = useRoute('/:ticker/trends')
  console.log({ match, params })
  return match ? <Trends {...props} /> : null
}

export default TrendsRoute
