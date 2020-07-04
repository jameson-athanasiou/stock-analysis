import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Button, Select, Typography } from 'antd'
import { LineChartOutlined, ProfileOutlined } from '@ant-design/icons'
import { useLocation } from 'wouter'
import { Transition } from 'react-transition-group'

const { Option } = Select
const { Title } = Typography

const tickers = [
  {
    name: 'Waste Management',
    symbol: 'WM',
  },
  {
    name: 'Sysco',
    symbol: 'SYY',
  },
  {
    name: 'Microsoft',
    symbol: 'MSFT',
  },
]

const transitionStyles = {
  entering: { opacity: 1 },
  entered: { opacity: 1 },
  exiting: { opacity: 0 },
  exited: { opacity: 0 },
}

const Home = ({ handleTickerUpdate }) => {
  const [location, setLocation] = useLocation()
  const [ticker, setTicker] = useState(null)

  return (
    <>
      <Title level={3}>Pick a stock!</Title>
      <Select
        showSearch
        style={{ width: '100%' }}
        placeholder="Select a ticker"
        optionFilterProp="children"
        onChange={(selectedTicker) => {
          setTicker(selectedTicker)
          handleTickerUpdate(selectedTicker)
        }}
        // onFocus={onFocus}
        // onBlur={onBlur}
        // onSearch={onSearch}
        // filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
      >
        {tickers.map(({ name, symbol }) => (
          <Option key={symbol} value={symbol}>
            {name} ({symbol})
          </Option>
        ))}
      </Select>
      {ticker ? (
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
            </div>
          )}
        </Transition>
      ) : null}
    </>
  )
}

Home.propTypes = {
  handleTickerUpdate: PropTypes.func.isRequired,
}

export default Home
