const TerserPlugin = require('terser-webpack-plugin')

module.exports = {
  entry: ['./client/src/index.js'],
  mode: 'production',
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin()],
    splitChunks: {
      chunks: 'all',
    },
  },
}
