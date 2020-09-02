import React, { Fragment, useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import { Button, Form, Input, Select, Typography, Upload } from 'antd'
import { LineChartOutlined, ProfileOutlined, UploadOutlined } from '@ant-design/icons'
import { useLocation } from 'wouter'
import { Transition } from 'react-transition-group'
import { useGet, usePost } from 'hooks/useApi'

const { Option } = Select
const { Title } = Typography

const onFinishFailed = (errorInfo) => {
  console.log('Failed:', errorInfo)
}

// const tickers = [
//   {
//     name: 'Waste Management',
//     symbol: 'WM',
//   },
//   {
//     name: 'Sysco',
//     symbol: 'SYY',
//   },
//   {
//     name: 'Microsoft',
//     symbol: 'MSFT',
//   },
// ]

const transitionStyles = {
  entering: { opacity: 1 },
  entered: { opacity: 1 },
  exiting: { opacity: 0 },
  exited: { opacity: 0 },
}

const layout = {
  labelCol: {
    span: 4,
  },
  wrapperCol: {
    span: 16,
  },
}

const Home = ({ handleTickerUpdate }) => {
  const [, setLocation] = useLocation()
  const [ticker, setTicker] = useState()
  const [uploadInfo, setUploadInfo] = useState({})
  const { data: availableTickers, loading } = useGet('availableTickers')
  console.log(availableTickers)
  const [upload] = usePost('add')

  const onFinish = (values) => {
    console.log('Success:', values)
    const formData = new FormData()
    Object.entries(values).forEach(([field, value]) => formData.append(field, value))
    formData.append('file', uploadInfo.file)
    upload(formData)
  }

  if (loading) return null

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
          if (selectedTicker !== 'other') {
            handleTickerUpdate(selectedTicker)
          }
        }}
      >
        {availableTickers.fullNames.map((name) => (
          <Option key={name} value={name}>
            {name}
          </Option>
        ))}
        <Option key="other" value="other">
          {"The company I want isn't here! (Other)"}
        </Option>
      </Select>
      {ticker && ticker !== 'other' ? (
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
      {ticker === 'other' ? (
        <>
          <Title style={{ marginTop: '50px' }} level={3}>
            {"Let's add a company!"}
          </Title>
          <Form name="New Ticker" {...layout} onFinish={onFinish} onFinishFailed={onFinishFailed}>
            {[
              ['Ticker', 'ticker'],
              ['Name', 'name'],
              ['Sector', 'sector'],
              ['Industry', 'industry'],
            ].map(([displayName, fieldName]) => (
              <Fragment key={displayName}>
                <Form.Item
                  label={displayName}
                  name={fieldName}
                  rules={[{ required: true, message: `${displayName} is required.` }]}
                >
                  <Input />
                </Form.Item>
              </Fragment>
            ))}
            <Form.Item
              name="upload"
              label="Upload"
              valuePropName="file"
              rules={[{ required: true, message: 'You must pick a file.' }]}
            >
              <Upload
                action="/add"
                name="file"
                beforeUpload={(file) => {
                  setUploadInfo((prev) => ({ ...prev, file }))
                  return false
                }}
              >
                <Button>
                  <UploadOutlined /> Pick a file
                </Button>
              </Upload>
            </Form.Item>
            <Form.Item>
              <Button type="primary" style={{ marginTop: 16 }} htmlType="submit">
                {'Start Upload'}
              </Button>
            </Form.Item>
          </Form>
        </>
      ) : null}
    </>
  )
}

Home.propTypes = {
  handleTickerUpdate: PropTypes.func.isRequired,
}

export default Home
