const bodyParser = require('body-parser')
const path = require('path')
const express = require('express')
const { getMorningstarData } = require('./services/morningstar')
const { discountedCashFlow, getProjections } = require('./services/valuation')
const { getStatistics } = require('./services/stockAnalysis')

const isProd = process.env.NODE_ENV === 'production'

const app = express()

app.use(bodyParser.json())

app.get('/historical-data', async (req, res) => {
  const { ticker } = req.query
  let status = 200

  try {
    const data = await getMorningstarData(ticker)
    res.status(status).send(data)
  } catch (err) {
    if (err.code === 'TICKER_MISSING') status = 500
    else if (err.code === 'FILE_NOT_FOUND') status = 404
    res.status(status).send({ error: err.message })
  }
})

app.get('/projections', async (req, res) => {
  const { ticker } = req.query
  const status = 200

  try {
    const morningstarData = await getMorningstarData(ticker)
    const data = await getProjections(morningstarData)
    res.status(status).send(data)
  } catch (err) {
    res.status(500).send({ error: err.message })
  }
})

app.get('/statistics', async (req, res) => {
  const { ticker } = req.query
  const status = 200

  try {
    const stats = await getStatistics(ticker, { withTitles: true })
    res.status(status).send(stats)
  } catch (err) {
    res.status(500).send({ error: err.message })
  }
})

app.post('/valuation', async (req, res) => {
  const { ticker, data } = req.body
})

app.use(express.static(path.join(__dirname, '../dist')))

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'))
})

const PORT = process.env.PORT || '3000'

if (!isProd) {
  require('./nonprod')(app) // eslint-disable-line
}

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`)
})
