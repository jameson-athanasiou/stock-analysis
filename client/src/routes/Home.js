import React from 'react'
import { useRoute } from 'wouter'
import Home from 'components/Home'

const HomeRoute = (props) => {
  const [match] = useRoute('/')
  return match ? <Home {...props} /> : null
}

export default HomeRoute
