import React from 'react'
import PropTypes from 'prop-types'
import { Table } from 'antd'

const Summary = ({ data, loading }) => {
  console.log(data)

  const dataSource = Object.entries(data).map(([key, value], i) => {
    const ttm = value.TTM
    const formattedTTM = ttm ? ttm.toString().replace(/(?<=\d)(?=(\d\d\d)+(?!\d))/, ',') : '--'
    return {
      key: i,
      metric: key,
      ttm: formattedTTM,
    }
  })

  const columns = [
    {
      title: 'Metric',
      dataIndex: 'metric',
      key: 'metric',
    },
    {
      title: 'TTM',
      dataIndex: 'ttm',
      key: 'ttm',
    },
  ]

  return <Table columns={columns} dataSource={dataSource} loading={loading} pagination={false} />
}

Summary.propTypes = {
  data: PropTypes.object,
  loading: PropTypes.bool.isRequired,
}

Summary.defaultProps = {
  data: {},
}

export default Summary
