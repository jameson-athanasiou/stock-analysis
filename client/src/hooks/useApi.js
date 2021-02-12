import { useEffect, useState } from 'react'
import axios from 'axios'

const formatUrlParams = (params) =>
  Object.entries(params).reduce((acc, [key, value], i) => `${acc}${!i ? '' : '&'}${key}=${value}`, '?')

export const useGet = (route, params = {}) => {
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

export const usePost = (route) => {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState()

  const post = async (postData) => {
    const result = axios.post(`/${route}`, postData).catch((e) => setError(e))
    setLoading(false)
    return result
  }

  return [post, error, loading]
}

export const useLazyGet = (route) => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState()

  const get = async (params = {}) => {
    setLoading(true)
    const queryParams = Object.keys(params).length ? formatUrlParams(params) : ''
    const result = await axios.get(`/${route}${queryParams}`).catch((e) => {
      setError(e)
      setLoading(false)
      throw e
    })
    setLoading(false)
    return result?.data
  }

  return [get, { error, loading }]
}
