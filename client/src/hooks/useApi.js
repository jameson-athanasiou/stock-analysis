import { useEffect, useState } from 'react'
import axios from 'axios'
import Cache from 'util/cache'

const requestCache = new Cache()

const formatUrlParams = (params) =>
  Object.entries(params).reduce((acc, [key, value], i) => `${acc}${!i ? '' : '&'}${key}=${value}`, '?')

export const useGet = (route, params = {}) => {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState()
  const [data, setData] = useState()

  useEffect(() => {
    const get = async () => {
      const queryParams = Object.keys(params).length ? formatUrlParams(params) : ''
      const url = `/${route}${queryParams}`

      const cachedRequest = requestCache.getRequest(url)
      if (cachedRequest) setData(cachedRequest)
      else {
        const result = await axios.get(`/${route}${queryParams}`).catch((e) => setError(e))
        const response = result?.data

        setData(response)
        if (response) requestCache.addRequest(url, response)
      }
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
