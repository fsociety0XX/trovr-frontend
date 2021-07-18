require('babel-polyfill')
const { merge } = require('webpack-merge')
const common = require('./webpack.common.js')
const path = require('path')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
  .BundleAnalyzerPlugin

module.exports = merge(common, {
  mode: 'development',
  entry: ['babel-polyfill', path.join(__dirname, 'src/index.js')],
  target: 'web',
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].js',
    publicPath: '/',
  },
  module: {
    rules: [
      {
        test: /\.less$/i,
        use: [
          // compiles Less to CSS
          'style-loader',
          'css-loader',
          'less-loader',
        ],
      },
      {
        test: /\.scss$/,
        use: ['style-loader', 'css-loader', 'sass-loader'],
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader', 'postcss-loader'],
      },
    ],
  },
  devServer: {
    historyApiFallback: true,
    port: 5000,
    hot: true,
  },
  plugins: [
    new BundleAnalyzerPlugin({
      analyzerPort: 5001,
      openAnalyzer: false,
      analyzerHost: 'localhost',
    }),
  ],
})
