import React from 'react'
import { useRoute } from 'wouter'
import Valuation from 'components/Valuation'

const ValuationRoute = (props) => {
  const [match] = useRoute('/:ticker/valuation')
  return match ? <Valuation {...props} /> : null
}

export default ValuationRoute
