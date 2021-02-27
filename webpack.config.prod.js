const TerserPlugin = require('terser-webpack-plugin')

module.exports = {
  devtool: 'none',
  entry: ['./client/src/index.js'],
  mode: 'production',
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin()],
  },
}
