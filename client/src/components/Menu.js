import React, { useState } from 'react'
import PropTypes from 'prop-types'
import {
  CalculatorOutlined,
  DollarOutlined,
  LineChartOutlined,
  ProfileOutlined,
  RocketOutlined,
} from '@ant-design/icons'
import { Layout, Menu } from 'antd'

const { Sider } = Layout

const NavMenu = ({ ticker, setLocation }) => {
  const [collapsed, setCollapsed] = useState(true)
  return (
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
        <Menu.Item
          key="4"
          icon={<RocketOutlined />}
          disabled={!ticker}
          onClick={() => setLocation(`/${ticker}/valuation`)}
        >
          Valuation
        </Menu.Item>
        <Menu.Item
          key="5"
          icon={<CalculatorOutlined />}
          disabled={!ticker}
          onClick={() => setLocation(`/${ticker}/statistics`)}
        >
          Statistics
        </Menu.Item>
      </Menu>
    </Sider>
  )
}

NavMenu.propTypes = {
  ticker: PropTypes.string,
  setLocation: PropTypes.func.isRequired,
}

NavMenu.defaultProps = {
  ticker: '',
}

export default NavMenu
