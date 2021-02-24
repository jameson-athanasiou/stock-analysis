const bodyParser = require('body-parser')
const path = require('path')
const express = require('express')
// const webpack = require('webpack')
// const webpackMiddleware = require('webpack-dev-middleware')
// const webpackConfig = require('../webpack.config.js')
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

// if (!isProd){
//   const compiler = webpack(webpackConfig)
//   app.use(
//     webpackMiddleware(compiler, {
//       publicPath: webpackConfig.output.publicPath,
//       writeToDisk: true,
//     })
//   )
// }

app.use(express.static(path.join(__dirname, '../dist')))

// app.get('/', (req, res) => {
//   res.sendFile(path.resolve(__dirname, '../dist/index.html'))
// })

const PORT = process.env.PORT || '3000'

app.listen(PORT, () => {
  console.log('Server started')
})
