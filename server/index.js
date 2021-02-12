const bodyParser = require('body-parser')
const path = require('path')
const express = require('express')
const fileUpload = require('express-fileupload')
const webpack = require('webpack')
const webpackMiddleware = require('webpack-dev-middleware')
const webpackConfig = require('../webpack.config.js')
const { getPageData } = require('./access')

const app = express()

app.use(bodyParser.json())
app.use(fileUpload())

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

const compiler = webpack(webpackConfig)
app.use(
  webpackMiddleware(compiler, {
    publicPath: webpackConfig.output.publicPath,
    writeToDisk: true,
  })
)

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../dist/index.html'))
})

app.listen('3000', () => {
  console.log('Server started')
})
