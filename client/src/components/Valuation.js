import React, { useCallback, useEffect, useState, useMemo } from 'react'
import { Button, Divider, Input, Table } from 'antd'
import { isEmpty, cloneDeep } from 'lodash'
import { useTickerContext } from 'context/Ticker/context'
import { useGet, usePost } from 'hooks/useApi'
import { isMobile } from 'util/browser'
import { useWindowWidth } from '@react-hook/window-size'

const mapRequest = (data) =>
  data.reduce((acc, metricData) => {
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
  const [variables, setVariables] = useState({
    discountRate: 0.1,
    terminalGrowthRate: 0.02,
  })

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
    updateValuation({ ticker, data: mapRequest(tableData) })
  }, [tableData, ticker])

  useEffect(() => {
    console.log(dataSource)
    if (!isEmpty(dataSource)) {
      const { metric, key, ...years } = dataSource.find((dataObj) => dataObj.metric === 'Free Cash Flow')

      // const yearsWithTerminalValue = Object.entries(years).map(([year, val]) => )

      setTableData(dataSource)
    }
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
      width: '10%',
    },
    {
      title: 'Value',
      dataIndex: 'value',
      key: 'value',
      editable: true,
      render: (val, { metric }) => {
        const id = `${metric}-value`
        return (
          <div id={id} style={{ width: '100px' }}>
            <Input
              allowClear
              bordered
              size="large"
              onChange={({ target: { value } }) => {
                setVariables((previousVariables) => ({
                  ...previousVariables,
                  [metric]: value,
                }))
              }}
              value={String(val)}
            />
          </div>
        )
      },
    },
  ]

  const variablesData = [
    {
      key: 0,
      metric: 'terminalGrowthRate',
      value: variables.terminalGrowthRate,
    },
    {
      key: 1,
      metric: 'discountRate',
      value: variables.discountRate,
    },
  ]

  return projectionsLoading ? null : (
    <>
      <Table columns={variablesColumns} dataSource={variablesData} loading={valuationLoading} pagination={false} />
      <Divider />
      <Table
        columns={projectionsColumns}
        dataSource={tableData}
        loading={projectionsLoading || valuationLoading || isEmpty(tableData)}
        pagination={false}
        scroll={{ x: true }}
        size={isMobile(screenWidth) ? 'small' : 'default'}
      />
      <Divider />
      <Button type="primary" onClick={() => makeUpdates()}>
        Update Valuation
      </Button>
    </>
  )
}

export default Valuation
