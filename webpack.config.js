const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const webpack = require('webpack');

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'docs'),
    filename: 'bundle.js',
    clean: {
      keep: /CNAME/
    }
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react']
          }
        }
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.jsx']
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
      filename: 'index.html'
    }),
    new CopyWebpackPlugin({
      patterns: [
        { from: 'resources', to: 'resources' }
      ]
    }),
    new webpack.DefinePlugin({
      'process.env.REACT_APP_ARTEMIS_API_KEY': JSON.stringify(process.env.REACT_APP_ARTEMIS_API_KEY),
      'process.env.REACT_APP_ARTEMIS_USE_LOCAL_ENDPOINT': JSON.stringify(process.env.REACT_APP_ARTEMIS_USE_LOCAL_ENDPOINT)
    })
  ],
  devServer: {
    static: {
      directory: path.join(__dirname, 'docs')
    },
    port: 3000,
    open: true,
    hot: true
  }
};