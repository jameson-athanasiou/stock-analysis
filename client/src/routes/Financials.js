import React from 'react'
import { useRoute } from 'wouter'
import Financials from 'components/Financials'

const FinancialsRoute = (props) => {
  const [match] = useRoute('/:ticker/financials')
  return match ? <Financials {...props} /> : null
}

export default FinancialsRoute
