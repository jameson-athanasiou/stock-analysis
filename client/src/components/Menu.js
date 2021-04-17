import React, { useState } from 'react'
import PropTypes from 'prop-types'
import {
  CalculatorOutlined,
  DollarOutlined,
  LineChartOutlined,
  ProfileOutlined,
  RocketOutlined,
  HomeOutlined,
  MenuOutlined,
} from '@ant-design/icons'
import { Layout, Menu, Dropdown, Button } from 'antd'

const { Item, SubMenu } = Menu

const NavMenu = ({ ticker, setLocation }) => {
  const disableItems = !ticker
  return (
    <Menu theme="dark" defaultSelectedKeys={['1']} mode="horizontal" selectable={false}>
      <Item key="0" icon={<HomeOutlined />} disabled={false} onClick={() => setLocation(`/`)}>
        Home
      </Item>
      <SubMenu key="SubMenu" icon={<DollarOutlined />} title="Financials" disabled={disableItems}>
        <Item
          key="1"
          icon={<ProfileOutlined />}
          disabled={disableItems}
          onClick={() => setLocation(`/${ticker}/summary`)}
        >
          Summary
        </Item>
        <Item key="2" disabled={disableItems} onClick={() => setLocation(`/${ticker}/financials`)}>
          Details
        </Item>
        <Item key="3" disabled={disableItems} onClick={() => setLocation(`/${ticker}/statistics`)}>
          Statistics
        </Item>
        <Item key="5" disabled={disableItems} onClick={() => setLocation(`/${ticker}/valuation`)}>
          Valuation
        </Item>
      </SubMenu>
      <Item
        key="4"
        icon={<LineChartOutlined />}
        disabled={disableItems}
        onClick={() => setLocation(`/${ticker}/trends`)}
      >
        Trends
      </Item>
    </Menu>
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
