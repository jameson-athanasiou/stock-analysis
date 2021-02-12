import React from 'react'
import PropTypes from 'prop-types'
import { Button, Input, Select, Typography } from 'antd'
import { DollarOutlined, LineChartOutlined, ProfileOutlined } from '@ant-design/icons'
import { useLocation } from 'wouter'
import { Transition } from 'react-transition-group'
import { useTickerContext } from 'context/Ticker/context'

const { Option } = Select
const { Search } = Input
const { Title } = Typography

const transitionStyles = {
  entering: { opacity: 1 },
  entered: { opacity: 1 },
  exiting: { opacity: 0 },
  exited: { opacity: 0 },
}

const Home = ({ availableTickers, handleTickerUpdate, tickerLoading }) => {
  const [, setLocation] = useLocation()
  const {
    tickerInfo: { ticker },
  } = useTickerContext()

  return (
    <>
      <Title level={3}>Pick a stock!</Title>
      <div style={{ maxWidth: '400px' }}>
        <Search
          placeholder="Enter a ticker"
          enterButton="Search"
          size="large"
          loading={tickerLoading}
          onSearch={(tickerInput) => handleTickerUpdate(tickerInput)}
        />
        <br />
        <br />
        {availableTickers.length ? (
          <Select
            autoClearSearchValue={false}
            showSearch
            style={{ width: '100%' }}
            placeholder="Previously searched tickers"
            optionFilterProp="children"
            onChange={(selectedTicker) => handleTickerUpdate(selectedTicker)}
          >
            {availableTickers.map((name, index) => (
              <Option key={name} value={availableTickers[index]}>
                {name}
              </Option>
            ))}
          </Select>
        ) : null}
      </div>
      {ticker && !tickerLoading ? (
        <Transition appear in={!!ticker} timeout={1000}>
          {(state) => (
            <div
              style={{
                transition: `opacity 1000ms ease-in-out`,
                opacity: 0,
                ...transitionStyles[state],
              }}
            >
              <Title style={{ marginTop: '50px' }} level={3}>
                What do you want to see?
              </Title>
              <Title style={{ marginTop: '20px' }} level={4}>
                {"A summary of the stock's metrics"}
              </Title>
              <Button type="primary" icon={<ProfileOutlined />} onClick={() => setLocation(`/${ticker}/summary`)}>
                Go to summary
              </Button>
              <Title style={{ marginTop: '20px' }} level={4}>
                Some trends over the past 10 years
              </Title>
              <Button type="primary" icon={<LineChartOutlined />} onClick={() => setLocation(`/${ticker}/trends`)}>
                Go to trends
              </Button>
              <Title style={{ marginTop: '20px' }} level={4}>
                Full financial breakdown
              </Title>
              <Button type="primary" icon={<DollarOutlined />} onClick={() => setLocation(`/${ticker}/financials`)}>
                Go to financials
              </Button>
            </div>
          )}
        </Transition>
      ) : null}
    </>
  )
}

Home.propTypes = {
  availableTickers: PropTypes.arrayOf(PropTypes.string).isRequired,
  handleTickerUpdate: PropTypes.func.isRequired,
  tickerLoading: PropTypes.bool,
}

export default Home
