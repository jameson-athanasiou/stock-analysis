import React from 'react'
import { Table } from 'antd'
import { useTickerContext } from 'context/Ticker/context'
import { useGet } from 'hooks/useApi'

const Statistics = () => {
  //   const dataSource = Object.entries(data).map(([key, value], i) => {
  //     const ttm = value.TTM
  //     const formattedTTM = ttm ? ttm.toString().replace(/(?<=\d)(?=(\d\d\d)+(?!\d))/, ',') : '--'
  //     return {
  //       key: i,
  //       metric: key,
  //       ttm: formattedTTM,
  //     }
  //   })

  //   const columns = [
  //     {
  //       title: 'Metric',
  //       dataIndex: 'metric',
  //       key: 'metric',
  //     },
  //     {
  //       title: 'TTM',
  //       dataIndex: 'ttm',
  //       key: 'ttm',
  //     },
  //   ]

  const {
    tickerInfo: { ticker },
  } = useTickerContext()

  const { data, error, loading } = useGet('statistics', { ticker })
  console.log(data)

  return 'statistics'
}

export default Statistics
