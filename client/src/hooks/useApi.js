import React, { useEffect, useState } from 'react'
import axios from 'axios'

export const useGet = ({ route }) => {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState()
  const [data, setData] = useState()

  useEffect(() => {
    const get = async () => {
      const result = await axios.get(`/${route}`).catch((e) => setError(e))
      if (result && result.data) setData(result.data)
      setLoading(false)
    }
    get()
  }, [])

  return { data, error, loading }
}
