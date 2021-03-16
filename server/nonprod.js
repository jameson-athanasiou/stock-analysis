const webpack = require('webpack')
const webpackMiddleware = require('webpack-dev-middleware')
const webpackConfig = require('../webpack.config.js')

const setupWebpackDev = (app) => {
  const compiler = webpack({ ...webpackConfig, watch: true })
  app.use(
    webpackMiddleware(compiler, {
      publicPath: webpackConfig.output.publicPath,
      writeToDisk: true,
    })
  )
}

module.exports = setupWebpackDev
