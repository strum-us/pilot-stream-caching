const Dotenv = require('dotenv-webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const { merge } = require('webpack-merge')
const config = require('./webpack.config.js')

// variables
const isProduction =
  process.argv.indexOf('-p') >= 0 || process.env.NODE_ENV === 'production'

module.exports = merge(config, {
  target: 'web',
  node: {
    fs: 'empty',
    net: 'empty',
  },
  entry: {
    app: './src/.entrypoint/app/index.tsx',
  },
  module: {
    rules: [
      // .ts, .tsx
      {
        test: /\.tsx?$/,
        use: [{
          loader: 'ts-loader',
        }].filter(Boolean),
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(a?png|jpe?g|gif|svg|bmp|mp3|mp4|ogg|wav|eot|ttf|woff|woff2|md|txt)$/,
        use: {
          loader: 'url-loader?limit=10000000',
          options: {
            esModule: false,
          },
        },
      },
    ],
  },

  plugins: [
    new Dotenv(),

    new HtmlWebpackPlugin({
      template: './src/assets/app.html',
      title: 'React, Tailwind and Webpack 5 Boilerplate',
      favicon: './src/assets/logo.svg',
    }),
  ],
})
