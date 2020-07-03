import React, { useState } from 'react'
import { capitalize } from 'lodash'
import { Layout, Menu, Breadcrumb, PageHeader } from 'antd'
import { LineChartOutlined, ProfileOutlined } from '@ant-design/icons'
import { useLocation } from 'wouter'
import { useGet } from 'hooks/useApi'
import { FIELDS } from 'constants'
import Summary from 'routes/Summary'
import Trends from 'routes/Trends'

const { Header, Content, Footer, Sider } = Layout

const { BOOK_VALUE_PER_SHARE, DIVIDENDS, EPS, FREE_CASH_FLOW, FREE_CASH_FLOW_PER_SHARE, NET_INCOME, REVENUE } = FIELDS

const App = () => {
  const fields = [
    BOOK_VALUE_PER_SHARE,
    DIVIDENDS,
    EPS,
    FREE_CASH_FLOW,
    FREE_CASH_FLOW_PER_SHARE,
    NET_INCOME,
    REVENUE,
  ].reduce((acc, curr) => `${acc},${curr}`)
  const { data, loading, error } = useGet({
    route: 'morningstar',
    params: {
      ticker: 'MSFT',
      fields,
    },
  })

  const [location, setLocation] = useLocation()
  const [ticker, setTicker] = useState('MSFT')
  const [sector, setSector] = useState('Something software')
  const [collapsed, setCollapsed] = useState(true)

  if (error) return <div>{error}</div>

  const breadcrumbs = location
    .split('/')
    .filter((item) => item)
    .filter((_, index) => index)
    .map((item) => capitalize(item))

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
          <PageHeader className="site-page-header" onBack={() => null} title={ticker} subTitle={sector} />
          <Content style={{ margin: '0 16px' }}>
            <Breadcrumb style={{ margin: '16px 0' }}>
              {breadcrumbs.map((item) => (
                <Breadcrumb.Item key={item}>{item}</Breadcrumb.Item>
              ))}
            </Breadcrumb>
            <Summary data={data} loading={loading} />
            <Trends />
          </Content>
        </Layout>
      </Layout>
    </div>
  )
}

export default App
