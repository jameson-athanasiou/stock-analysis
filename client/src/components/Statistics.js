import React from 'react'
import { Skeleton, Space, Table, Typography } from 'antd'
import { useTickerContext } from 'context/Ticker/context'
import { useGet } from 'hooks/useApi'

const Statistics = () => {
  const {
    tickerInfo: { ticker },
  } = useTickerContext()

  const { data, error, loading } = useGet('statistics', { ticker })
  console.log(data)

  const getTables = () =>
    data.map((category) =>
      Object.entries(category).map(([categoryTitle, categoryData]) => {
        const dataSource = Object.entries(categoryData).map(([metric, value], key) => ({
          metric,
          value,
          key,
        }))

        const columns = [
          {
            title: 'metric',
            dataIndex: 'metric',
          },
          {
            title: 'value',
            dataIndex: 'value',
            fixed: 'right',
          },
        ]

        return (
          <Table
            tableLayout="fixed"
            columns={columns}
            pagination={false}
            showHeader={false}
            dataSource={dataSource}
            title={() => <Typography.Title level={3}>{categoryTitle}</Typography.Title>}
            key={categoryTitle}
          ></Table>
        )
      })
    )

  return loading ? <Skeleton active title paragraph={{ rows: 2 }} /> : <Space direction="vertical">{getTables()}</Space>
}

export default Statistics
