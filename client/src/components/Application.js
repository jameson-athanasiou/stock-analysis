import React from 'react'
import { useGet } from 'hooks/useApi'
import { FIELDS } from 'constants'

const { BOOK_VALUE_PER_SHARE, DIVIDENDS, EPS, FREE_CASH_FLOW, FREE_CASH_FLOW_PER_SHARE, NET_INCOME, REVENUE } = FIELDS

const App = () => {
  const fields = [
    BOOK_VALUE_PER_SHARE,
    DIVIDENDS,
    EPS,
    FREE_CASH_FLOW,
    FREE_CASH_FLOW_PER_SHARE,
    NET_INCOME,
    REVENUE,
  ].reduce((acc, curr) => `${acc},${curr}`)
  const { data, loading, error } = useGet({
    route: 'morningstar',
    params: {
      ticker: 'MSFT',
      fields,
    },
  })

  if (loading) return <div>loading...</div>
  if (error) return <div>{error}</div>

  console.log(data)

  return <div>hello world</div>
}

export default App
