import React from 'react'
import PropTypes from 'prop-types'
import { Table } from 'antd'
import { head, last } from 'lodash'
import { useWindowWidth } from '@react-hook/window-size'
import { isMobile } from 'util/browser'
import { averageAnnualGrowthRate } from 'util/finance'

const Financials = ({ data, loading }) => {
  console.log(data)
  const screenWidth = useWindowWidth({ leading: true })

  const dataSource = Object.entries(data).map(([key, value], i) => {
    const yearData = Object.entries(value).filter(([year]) => year !== 'TTM')

    const [, firstYearVal] = head(yearData)
    const [, lastYearVal] = last(yearData)
    const [, secondToLastYearVal] = yearData[yearData.length - 2]

    const growth = (lastYearVal / firstYearVal - 1) * 100
    const growthYoy = (lastYearVal / secondToLastYearVal - 1) * 100

    const values = yearData.map(([, val]) => val)

    const aagr = averageAnnualGrowthRate(values)

    const finalFourYears = values.slice(values.length - 4)
    const aagrThreeYear = averageAnnualGrowthRate(finalFourYears)

    const formattedValues = yearData.reduce(
      (acc, [currentYear, currentValue]) => ({
        ...acc,
        [currentYear]: currentValue ? currentValue.toString().replace(/(?<=\d)(?=(\d\d\d)+(?!\d))/, ',') : '--',
      }),
      {}
    )
    return {
      key: i,
      metric: key,
      aagr,
      aagrThreeYear,
      growth,
      growthYoy,
      ...formattedValues,
    }
  })

  const yearColumns = Object.keys(Object.entries(data)?.[0]?.[1] || {})
    .filter((key) => key !== 'TTM')
    .map((key) => ({
      title: key,
      dataIndex: key,
      key: 'value',
    }))

  const columns = [
    {
      title: 'Metric',
      dataIndex: 'metric',
      key: 'metric',
    },
    ...yearColumns,
  ]

  console.log(columns)

  return (
    <Table
      columns={columns}
      dataSource={dataSource}
      expandable={{
        expandedRowRender: (record) => (
          <>
            <p style={{ margin: 0 }}>AAGR {record.aagr.toFixed(2)} %</p>
            <p style={{ margin: 0 }}>AAGR 3Y {record.aagrThreeYear.toFixed(2)} %</p>
            <p style={{ margin: 0 }}>Year over year growth {record.growthYoy.toFixed(2)} %</p>
            <p style={{ margin: 0 }}>Growth over entire timespan {record.growth.toFixed(2)} %</p>
          </>
        ),
      }}
      loading={loading}
      pagination={false}
      scroll={{ x: true }}
      size={isMobile(screenWidth) ? 'small' : 'default'}
    />
  )
}

Financials.propTypes = {
  data: PropTypes.object,
  loading: PropTypes.bool.isRequired,
}

Financials.defaultProps = {
  data: {},
}

export default Financials
