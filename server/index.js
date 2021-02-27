const bodyParser = require('body-parser')
const path = require('path')
const express = require('express')

const { getPageData } = require('./access')

const isProd = process.env.NODE_ENV === 'production'

const app = express()

app.use(bodyParser.json())

app.get('/morningstar', async (req, res) => {
  const { ticker } = req.query
  let status = 200

  try {
    if (!ticker) {
      const tickerMissingError = new Error('Ticker not present')
      tickerMissingError.code = 'TICKER_MISSING'
      throw tickerMissingError
    }
    const data = await getPageData(ticker)
    if (data) {
      res.status(status).send(data)
    } else res.status(500).send({ error: 'Something went wrong on the server' })
  } catch (err) {
    if (err.code === 'TICKER_MISSING') status = 500
    else if (err.code === 'FILE_NOT_FOUND') status = 404
    res.status(status).send({ error: err.message })
  }
})

app.use(express.static(path.join(__dirname, '../dist')))

const PORT = process.env.PORT || '3000'

if (!isProd) {
  require('./nonprod')(app) // eslint-disable-line
}

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`)
})
