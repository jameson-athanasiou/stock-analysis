import React from 'react'
import PropTypes from 'prop-types'
import { Table } from 'antd'
import { useTickerContext } from 'context/Ticker/context'
import { useGet } from 'hooks/useApi'

const Valuation = () => {
  const {
    tickerInfo: { ticker },
  } = useTickerContext()

  const { data, error, loading } = useGet('projections', { ticker })
  console.log(data)

  //   return <Table columns={columns} dataSource={dataSource} loading={loading} pagination={false} />
  return <div>test</div>
}

export default Valuation
