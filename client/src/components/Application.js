import React from 'react'
import { useGet } from 'hooks/useApi'

const App = () => {
  const { data, loading, error } = useGet({ route: 'ticker' })

  if (loading) return <div>loading...</div>
  if (error) return <div>{error}</div>

  console.log(data)

  return <div>hello world</div>
}

export default App
