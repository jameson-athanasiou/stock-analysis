import React from 'react'
import TickerContext from './context'

const TickerProvider = ({ children, tickerInfo }) => {
  const tickerContextValue = {
    tickerInfo,
  }

  return <TickerContext.Provider value={tickerContextValue}>{children}</TickerContext.Provider>
}

export default TickerProvider
