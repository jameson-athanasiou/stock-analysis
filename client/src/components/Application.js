import React, { useEffect, useState } from 'react'
import { capitalize, uniq } from 'lodash'
import { Layout, message, Breadcrumb, PageHeader } from 'antd'
import { ArrowLeftOutlined } from '@ant-design/icons'
import { useLocation } from 'wouter'
import { useLazyGet } from 'hooks/useApi'
import Home from 'routes/Home'
import Financials from 'routes/Financials'
import Summary from 'routes/Summary'
import Trends from 'routes/Trends'
import Valuation from 'routes/Valuation'
import Statistics from 'routes/Statistics'
import { getTickerFromLocation } from 'util/location'
import TickerProvider from 'context/Ticker/provider'
import NavMenu from './Menu'

const { Content, Sider } = Layout

const App = () => {
  const [location, setLocation] = useLocation()
  const [ticker, setTicker] = useState(getTickerFromLocation(location) || '')
  const [sector, setSector] = useState('')
  const [tickerData, setTickerData] = useState({})
  const [fetchedTickers, setFetchedTickers] = useState([])
  const [getTickerData, { loading, error }] = useLazyGet('historical-data')

  useEffect(() => {
    if (ticker) {
      const stopLoading = message.loading('Fetching data', 0)

      getTickerData({ ticker })
        .then((result) => {
          const formattedResults = Object.entries(result).reduce((acc, [metric, data]) => {
            const [formattedMetric] = metric.replace(/\*/g, '').split('USD')
            return {
              ...acc,
              [formattedMetric.trim()]: data,
            }
          }, {})

          setTickerData(formattedResults)
          setFetchedTickers((prevState) => uniq([...prevState, ticker]))
          stopLoading()

          if (result.error) message.error('Something went wrong', 5)
          else message.success('Success!', 3)
        })
        .catch((e) => {
          console.warn(e)
          message.error('Something went wrong', 5)
        })
    }
  }, [ticker])

  if (!ticker) {
    setLocation('/')
  }

  const handleTickerUpdate = (selectedTicker) => setTicker(selectedTicker.toUpperCase())

  const breadcrumbs = location
    .split('/')
    .filter((item) => item.toUpperCase() !== ticker.toUpperCase())
    .map((item) => capitalize(item))
    .map((item) => item || 'Home')
    .filter((item, index) => !(item === 'Home' && index))

  return (
    <div className="App">
      <TickerProvider tickerInfo={{ ticker }}>
        <Layout style={{ minHeight: '100vh' }}>
          <NavMenu ticker={ticker} setLocation={setLocation} />
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
              <Home handleTickerUpdate={handleTickerUpdate} availableTickers={fetchedTickers} tickerLoading={loading} />
              <Financials data={tickerData} loading={loading} />
              <Summary data={tickerData} loading={loading} />
              <Trends data={tickerData} loading={loading} />
              <Valuation data={tickerData} loading={loading} />
              <Statistics />
            </Content>
          </Layout>
        </Layout>
      </TickerProvider>
    </div>
  )
}

export default App
