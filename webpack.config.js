const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
// const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin')

module.exports = {
  devServer: {
    inline: true,
    hot: true,
    writeToDisk: true,
  },
  devtool: 'eval-source-map',
  entry: ['webpack-hot-middleware/client', './client/src/index.js'],
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            babelrc: true,
            plugins: [require.resolve('react-refresh/babel')],
          },
        },
      },
    ],
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/',
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './client/index.html',
    }),
    new webpack.HotModuleReplacementPlugin(),
//     new ReactRefreshWebpackPlugin({
//       overlay: {
//         sockIntegration: 'whm',
//       },
//     }),
  ],
  stats: {
    colors: true,
    entrypoints: true,
  },
  watch: true,
}
