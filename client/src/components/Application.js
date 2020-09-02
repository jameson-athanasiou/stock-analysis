import React, { useCallback, useEffect, useState } from 'react'
import { capitalize } from 'lodash'
import { Layout, Menu, Breadcrumb, PageHeader } from 'antd'
import { ArrowLeftOutlined, LineChartOutlined, ProfileOutlined } from '@ant-design/icons'
import { useLocation } from 'wouter'
import { useLazyGet } from 'hooks/useApi'
import { FIELDS } from 'constants'
import Home from 'routes/Home'
import Summary from 'routes/Summary'
import Trends from 'routes/Trends'

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
  const fields = fieldsToSelect.reduce((acc, curr) => `${acc},${FIELDS[curr]}`)

  const [location, setLocation] = useLocation()
  const [ticker, setTicker] = useState('')
  const [sector, setSector] = useState('Something software')
  const [tickerData, setTickerData] = useState({})
  const [collapsed, setCollapsed] = useState(true)
  const [getTickerData, { loading, error }] = useLazyGet('morningstar')

  useEffect(() => {
    getTickerData({ ticker, fields }).then((result) => {
      setTickerData(result)
    })
  }, [ticker])

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
            <Menu.Item key="1" icon={<ProfileOutlined />} onClick={() => setLocation(`/${ticker}/summary`)}>
              Summary
            </Menu.Item>
            <Menu.Item key="2" icon={<LineChartOutlined />} onClick={() => setLocation(`/${ticker}/trends`)}>
              Trends
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
            <Summary data={tickerData} loading={loading} />
            <Trends data={tickerData} loading={loading} />
          </Content>
        </Layout>
      </Layout>
    </div>
  )
}

export default App
