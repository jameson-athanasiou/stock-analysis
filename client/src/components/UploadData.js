import React from 'react'
import { Input, Typography } from 'antd'

const { Title } = Typography

const fieldMap = {
  industry: 'Industry',
  name: 'Company Name',
  sector: 'Sector',
  ticker: 'Ticker',
}

const UploadData = ({ fieldName, inError, updateData }) => {
  const displayName = fieldMap[fieldName]
  console.log('what')
  return (
    <>
      <Title style={{ marginTop: '20px' }} level={4}>
        {displayName}
      </Title>
      <Input placeholder={displayName} onChange={(val) => updateData(fieldName, val)} />
    </>
  )
}

export default UploadData
