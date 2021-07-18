const HtmlWebpackPlugin = require('html-webpack-plugin')
const Dotenv = require('dotenv-webpack')

module.exports = {
  module: {
    rules: [
      {
        test: /\.js|\.jsx$/,
        exclude: /node_modules/,
        use: { loader: 'babel-loader' },
      },
      {
        test: /\.(jpe?g|png|gif|svg|woff(2)?|ttf|eot|svg|ico)$/i,
        use: 'file-loader',
      },
    ],
  },
  // Setup plugin to use a HTML file for serving bundled js files
  plugins: [
    new Dotenv(),
    new HtmlWebpackPlugin({
      template: './src/index.html',
      favicon: './src/assets/images/favicon.png',
    }),
  ],
}
