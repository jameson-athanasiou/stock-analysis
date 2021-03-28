import React, { useCallback, useEffect, useState, useMemo } from 'react'
import { Button, Space, Input, Table } from 'antd'
import { isEmpty, cloneDeep } from 'lodash'
import { useTickerContext } from 'context/Ticker/context'
import { useGet, usePost } from 'hooks/useApi'
import { isMobile } from 'util/browser'
import { useWindowWidth } from '@react-hook/window-size'

const mapRequest = (data) =>
  data.reduce((acc, metricData) => {
    console.log(metricData)
    const { metric, key, ...rest } = metricData
    return {
      ...acc,
      [metric]: rest,
    }
  }, {})

const Valuation = () => {
  const {
    tickerInfo: { ticker },
  } = useTickerContext()
  const screenWidth = useWindowWidth({ leading: true })
  const { data: projectionsData, loading: projectionsLoading } = useGet('projections', { ticker })
  const [updateValuation, { data: valuationData, loading: valuationLoading }] = usePost('valuation')

  const [tableData, setTableData] = useState({})

  const dataSource = useMemo(
    () =>
      Object.entries(projectionsData || {}).map(([key, value], i) => {
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
    [projectionsData]
  )

  const makeUpdates = useCallback(() => {
    console.log(tableData)
    updateValuation({ ticker, data: mapRequest(tableData) })
  }, [tableData, ticker])

  useEffect(() => {
    setTableData(dataSource)
  }, [dataSource])

  const yearColumns = Object.keys(Object.entries(projectionsData || {})?.[0]?.[1] || {})
    .filter((key) => key !== 'TTM')
    .map((key) => ({
      title: key,
      dataIndex: key,
      key: 'value',
      editable: true,
      align: 'center',
      render: (val, _, index) => {
        const id = `${tableData[index].metric}-${key}`
        return (
          <div id={id} style={{ width: '100px' }}>
            <Input
              allowClear
              bordered
              size="large"
              onChange={({ target: { value } }) => {
                const updatedData = cloneDeep(tableData)
                updatedData[index][key] = Number(value)
                setTableData(updatedData)
              }}
              value={String(val)}
            />
          </div>
        )
      },
    }))

  const projectionsColumns = [
    {
      title: 'Metric',
      dataIndex: 'metric',
      key: 'metric',
    },
    ...yearColumns,
  ]

  const variablesColumns = [
    {
      title: 'Metric',
      dataIndex: 'metric',
      key: 'metric',
    },
    {
      title: 'Value',
      dataIndex: 'value',
      key: 'value',
    },
  ]

  const variablesData = [
    {
      key: 0,
      metric: 'terminalGrowthRate',
      value: 0.02,
    },
    {
      key: 1,
      metric: 'discountRate',
      value: 0.1,
    },
  ]

  return projectionsLoading ? null : (
    <Space size="large" direction="vertical">
      <Table columns={variablesColumns} dataSource={variablesData} />
      <Table
        columns={projectionsColumns}
        dataSource={tableData}
        loading={projectionsLoading || isEmpty(tableData)}
        pagination={false}
        scroll={{ x: true }}
        size={isMobile(screenWidth) ? 'small' : 'default'}
      />
      <Button type="primary" onClick={() => makeUpdates()}>
        Update Valuation
      </Button>
    </Space>
  )
}

export default Valuation
