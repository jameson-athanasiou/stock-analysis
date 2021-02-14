import React, { useContext } from 'react'

const TickerContext = React.createContext({
  tickerInfo: {},
  setTickerInfo: () => {},
})

export default TickerContext

export const useTickerContext = () => useContext(TickerContext)
