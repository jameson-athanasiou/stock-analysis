import React, { useEffect, useState, useMemo } from 'react'
import { Input, Table } from 'antd'
import { isEmpty, cloneDeep } from 'lodash'
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

  const [valuationData, setValuationData] = useState({})

  const dataSource = useMemo(
    () =>
      Object.entries(data || {}).map(([key, value], i) => {
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
      }),
    [data]
  )

  useEffect(() => {
    setValuationData(dataSource)
  }, [dataSource])

  const yearColumns = Object.keys(Object.entries(data || {})?.[0]?.[1] || {})
    .filter((key) => key !== 'TTM')
    .map((key) => ({
      title: key,
      dataIndex: key,
      key: 'value',
      editable: true,
      align: 'center',
      render: (val, _, index) => {
        const id = `${valuationData[index].metric}-${key}`
        return (
          <div id={id} style={{ width: '100px' }}>
            <Input
              allowClear
              bordered
              size="large"
              onChange={({ target: { value } }) => {
                const updatedData = cloneDeep(valuationData)
                updatedData[index][key] = Number(value)
                setValuationData(updatedData)
              }}
              value={String(val)}
            />
          </div>
        )
      },
    }))

  const columns = [
    {
      title: 'Metric',
      dataIndex: 'metric',
      key: 'metric',
    },
    ...yearColumns,
  ]

  return loading ? null : (
    <Table
      columns={columns}
      dataSource={valuationData}
      loading={loading || isEmpty(valuationData)}
      pagination={false}
      scroll={{ x: true }}
      size={isMobile(screenWidth) ? 'small' : 'default'}
    />
  )
}

export default Valuation
