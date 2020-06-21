import { useEffect, useState } from 'react'
import axios from 'axios'

const formatUrlParams = (params) =>
  Object.entries(params).reduce((acc, [key, value], i) => `${acc}${!i ? '' : '&'}${key}=${value}`, '?')

export const useGet = ({ params, route }) => {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState()
  const [data, setData] = useState()

  useEffect(() => {
    const get = async () => {
      const queryParams = Object.keys(params).length ? formatUrlParams(params) : ''
      const result = await axios.get(`/${route}${queryParams}`).catch((e) => setError(e))
      if (result && result.data) setData(result.data)
      setLoading(false)
    }
    get()
  }, [])

  return { data, error, loading }
}
