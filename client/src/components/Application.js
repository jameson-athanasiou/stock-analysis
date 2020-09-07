import React, { useCallback, useEffect, useState } from 'react'
import { capitalize } from 'lodash'
import { Layout, Menu, Breadcrumb, PageHeader } from 'antd'
import { ArrowLeftOutlined, DollarOutlined, LineChartOutlined, ProfileOutlined } from '@ant-design/icons'
import { useLocation } from 'wouter'
import { useLazyGet } from 'hooks/useApi'
import { REMOTE_FIELDS } from 'constants'
import Home from 'routes/Home'
import Financials from 'routes/Financials'
import Summary from 'routes/Summary'
import Trends from 'routes/Trends'
import { getTickerFromLocation } from 'util/location'

const { Content, Sider } = Layout

const fieldsToSelect = [
  'BOOK_VALUE_PER_SHARE',
  'DIVIDENDS',
  'EPS',
  'FREE_CASH_FLOW',
  'FREE_CASH_FLOW_PER_SHARE',
  'NET_INCOME',
  'OPERATING_CASH_FLOW',
  'REVENUE',
]

const App = () => {
  const fields = fieldsToSelect.reduce((acc, curr) => `${acc},${REMOTE_FIELDS[curr]}`)

  const [location, setLocation] = useLocation()
  const [ticker, setTicker] = useState(getTickerFromLocation(location) || '')
  const [sector, setSector] = useState('')
  const [tickerData, setTickerData] = useState({})
  const [collapsed, setCollapsed] = useState(true)
  const [getTickerData, { loading, error }] = useLazyGet('morningstar')

  useEffect(() => {
    getTickerData({ ticker, fields }).then((result) => {
      const formattedResults = Object.entries(result).reduce((acc, [metric, data]) => {
        const [formattedMetric] = metric.replace(/\*/g, '').split('USD')
        return {
          ...acc,
          [formattedMetric.trim()]: data,
        }
      }, {})
      setTickerData(formattedResults)
    })
  }, [ticker])

  if (!ticker) {
    setLocation('/')
  }

  const handleTickerUpdate = (selectedTicker) => setTicker(selectedTicker)

  const breadcrumbs = location
    .split('/')
    .filter((item) => item.toUpperCase() !== ticker.toUpperCase())
    .map((item) => capitalize(item))
    .map((item) => item || 'Home')
    .filter((item, index) => !(item === 'Home' && index))

  return (
    <div className="App">
      <Layout style={{ minHeight: '100vh' }}>
        <Sider collapsible collapsed={collapsed} onCollapse={setCollapsed}>
          <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline">
            <Menu.Item
              key="1"
              icon={<ProfileOutlined />}
              disabled={!ticker}
              onClick={() => setLocation(`/${ticker}/summary`)}
            >
              Summary
            </Menu.Item>
            <Menu.Item
              key="2"
              icon={<LineChartOutlined />}
              disabled={!ticker}
              onClick={() => setLocation(`/${ticker}/trends`)}
            >
              Trends
            </Menu.Item>
            <Menu.Item
              key="3"
              icon={<DollarOutlined />}
              disabled={!ticker}
              onClick={() => setLocation(`/${ticker}/financials`)}
            >
              Financials
            </Menu.Item>
          </Menu>
        </Sider>
        <Layout className="site-layout">
          <PageHeader
            className="site-page-header"
            title={ticker}
            subTitle={sector}
            backIcon={breadcrumbs.length > 1 ? <ArrowLeftOutlined /> : null}
            onBack={() => setLocation('/')}
          />
          <Content style={{ margin: '0 16px' }}>
            <Breadcrumb style={{ margin: '16px 0' }}>
              {breadcrumbs.map((item) => (
                <Breadcrumb.Item key={item}>{item}</Breadcrumb.Item>
              ))}
            </Breadcrumb>
            <Home handleTickerUpdate={handleTickerUpdate} />
            <Financials data={tickerData} loading={loading} />
            <Summary data={tickerData} loading={loading} />
            <Trends data={tickerData} loading={loading} />
          </Content>
        </Layout>
      </Layout>
    </div>
  )
}

export default App
