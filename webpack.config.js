const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin')
const prodConfig = require('./webpack.config.prod')
const devConfig = require('./webpack.config.dev')

const isProd = process.env.NODE_ENV === 'production'
const config = isProd ? prodConfig : devConfig

const plugins = [
  new HtmlWebpackPlugin({
    template: './client/index.html',
  }),
  new LodashModuleReplacementPlugin(),
]

if (!isProd) plugins.push(new webpack.HotModuleReplacementPlugin())

module.exports = {
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
  plugins,
  stats: {
    colors: true,
    entrypoints: true,
  },
  ...config,
}
