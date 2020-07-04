import React from 'react'
import { useRoute } from 'wouter'
import Summary from 'components/Summary'

const SummaryRoute = (props) => {
  const [match] = useRoute('/:ticker/summary')
  return match ? <Summary {...props} /> : null
}

export default SummaryRoute
