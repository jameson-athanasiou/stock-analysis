import React from 'react'
import PropTypes from 'prop-types'
import { Table } from 'antd'
import { useTickerContext } from 'context/Ticker/context'
import { useGet } from 'hooks/useApi'
import { isMobile } from 'util/browser'
import { useWindowWidth } from '@react-hook/window-size'

const Valuation = () => {
  const {
    tickerInfo: { ticker },
  } = useTickerContext()
  const screenWidth = useWindowWidth({ leading: true })
  const { data, error, loading } = useGet('projections', { ticker })
  console.log(data)

  const dataSource = Object.entries(data).map(([key, value], i) => {
    const yearData = Object.entries(value).filter(([year]) => year !== 'TTM')
    const formattedValues = yearData.reduce(
      (acc, [currentYear, currentValue]) => ({
        ...acc,
        [currentYear]: currentValue,
      }),
      {}
    )
    return {
      key: i,
      metric: key,
      ...formattedValues,
    }
  })

  return (
    <Table
      columns={columns}
      dataSource={dataSource}
      loading={loading}
      pagination={false}
      scroll={{ x: true }}
      size={isMobile(screenWidth) ? 'small' : 'default'}
    />
  )
}

export default Valuation
