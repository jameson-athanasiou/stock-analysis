const bodyParser = require('body-parser')
const path = require('path')
const fs = require('fs')
const express = require('express')
const fileUpload = require('express-fileupload')
const { startCase } = require('lodash')
const readdirp = require('readdirp')
const webpack = require('webpack')
const webpackMiddleware = require('webpack-dev-middleware')
const webpackConfig = require('../webpack.config.js')
const getMorningstarData = require('./morningstar')

const app = express()

const isProd = process.env.NODE_ENV === 'production'

app.use(bodyParser.json())
app.use(fileUpload())

app.get('/availableTickers', async (req, res) => {
  const files = await readdirp.promise('.', {
    directoryFilter: ['!client', '!.git', '!node_modules'],
    fileFilter: '*.csv',
  })

  const paths = files.map((file) => file.path)
  const data = paths.reduce((acc, curr) => {
    const { companies = [], fullNames = [], industries = [], sectors = [], tickers = [] } = acc
    const [, , sector, industry, company] = curr.split('/')
    const [name, tickerFile] = company.split('-')
    const [ticker] = tickerFile.split('.')
    return {
      companies: [...companies, name.trim()].sort(),
      fullNames: [...fullNames, `${name.trim()} (${ticker.trim()})`].sort(),
      industries: [...industries, industry].sort(),
      sectors: [...sectors, sector].sort(),
      tickers: [...tickers, ticker.trim()].sort(),
    }
  }, {})

  res.status(200).send(data)
})

app.get('/morningstar', async (req, res) => {
  const { ticker, fields } = req.query
  let status = 200

  try {
    const data = await getMorningstarData(ticker, fields)
    if (data) {
      res.status(status).send(data)
    } else res.status(500).send({ error: 'Something went wrong on the server' })
  } catch (err) {
    if (err.code === 'TICKER_MISSING') status = 500
    else if (err.code === 'FILE_NOT_FOUND') status = 404
    res.status(status).send({ error: err.message })
  }
})

app.post('/add', (req, res) => {
  if (!req.files) res.status(400).send({ message: 'no file uploaded' })

  const { industry, name, sector, ticker } = req.body
  const filePath = `${process.cwd()}/data/exports/${startCase(sector)}/${startCase(industry)}/`
  const fileName = `${startCase(name)} - ${ticker.toUpperCase()}.csv`
  const { file } = req.files

  if (!fs.existsSync(filePath)) {
    fs.mkdirSync(filePath, { recursive: true })
  }

  file.mv(`${filePath}/${fileName}`, (err) => {
    if (err) res.status(500).send(err)
    res.status(204).send()
  })
})

const compiler = webpack(webpackConfig)
app.use(
  webpackMiddleware(compiler, {
    writeToDisk: true,
  })
)

app.get('*', (req, res) => {
  console.log(__dirname)
  res.sendFile(path.resolve(__dirname, '../dist/index.html'))
})

app.listen('3000', () => {
  console.log('Server started')
})
