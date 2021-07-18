const { merge } = require('webpack-merge')
const common = require('./webpack.common.js')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const path = require('path')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const TerserPlugin = require('terser-webpack-plugin')

module.exports = merge(common, {
  mode: 'production',
  //entry: {main: path.join(__dirname, 'src/index.js'), app: path.join(__dirname, 'src/components/App.js')}, //use multiple entry point of file with this main entry point to chunk that page or module and all its imported dependancy in different bundle with lazy loading at route level
  entry: ['babel-polyfill', path.join(__dirname, 'src/index.js')],
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].[contenthash].js', //contain hash for every chunk so we can manage cache well
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
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader'],
      },
    ],
  },
  optimization: {
    runtimeChunk: 'single', //contain all dependancy for run application
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/, //seprate out whole vedor folder in one chunk
          name: 'vendors',
          chunks: 'all',
        },
      },
    },
    minimize: true,
    minimizer: [
      new TerserPlugin(), //minimise JS
      new CssMinimizerPlugin(), //minimise css file
    ],
  },
  plugins: [
    new CleanWebpackPlugin(), //clean the dist folder before new build
    new MiniCssExtractPlugin({
      //extract all the css into one file and chunk if size increases
      filename: 'style.css',
      chunkFilename: '[name].css',
    }),
  ],
})
