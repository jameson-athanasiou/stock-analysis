module.exports = {
  devServer: {
    inline: true,
    hot: true,
    writeToDisk: true,
  },
  devtool: 'eval-source-map',
  entry: ['webpack-hot-middleware/client', './client/src/index.js'],
  mode: 'development',
}
