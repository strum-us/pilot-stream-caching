
const CssNano = require('cssnano')
const { EnvironmentPlugin } = require('webpack')
const { merge } = require('webpack-merge')
const path = require('path')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')

const webpack = require('webpack')
const config = require('./webpack.config.js')
const outPath = path.join(__dirname, './build')
// console.log({ outPath })
const sourcePath = path.join(__dirname, './src')

// variables
const isProduction =
  process.argv.indexOf('-p') >= 0 || process.env.NODE_ENV === 'production'

module.exports = merge(config, {
  target: 'web',
  entry: {
    app: './src/.entrypoint/app/index.tsx',
  },
  output: {
    path: outPath,
    filename: '[name].[hash:8].js',
    chunkFilename: '[id].[hash:8].js',
  },
  module: {
    rules: [
      // .ts, .tsx
      {
        test: /\.tsx?$/,
        use: [
          !isProduction && {
            loader: 'babel-loader',
            options: { plugins: ['react-hot-loader/babel'] },
          },
          'ts-loader',
        ].filter(Boolean),
      },
      // css
      {
        test: /\.css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {},
          },
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: [
                  CssNano({
                    preset: 'default',
                  }),
                ],
              },
            },
          },
        ],
      },

      // html
      // { test: /\.html$/, use: 'html-loader' },

      // svg
      {
        test: /\.(svg)$/,
        use: {
          loader: 'url-loader?limit=10000',
          options: {
            esModule: false,
          },
        },
      },
      {
        test: /\.(a?png|jpe?g|gif|bmp|mp3|mp4|ogg|wav|eot|ttf|woff|woff2|md|txt)$/,
        loader: 'file-loader?name=/img[name].[ext]',
        options: {
          name(resourcePath, resourceQuery) {
            return '[name].[ext]'
          },
          outputPath: 'img',
        },
      },

      // font
      // {
      //   test: /\.(woff2?|ttf|eot)(\?-.*)?$/,
      //   loader: 'file-loader',
      //   options: {
      //     name: 'assets/fonts/[contenthash].[ext]',
      //     esModule: false,
      //   },
      // },

      // // file
      // {
      //   test: /\.(png|jpe?g|ico|gif)(\?-.*)?$/,
      //   loader: 'file-loader',
      //   options: {
      //     name: 'assets/img/[contenthash].[ext]',
      //     esModule: false,
      //   },
      // },

      // file
      // {
      //   test: /\.(a?png|jpe?g|gif|bmp|mp3|mp4|ogg|wav|eot|ttf|woff|woff2|md|txt)$/,
      //   loader: 'file-loader?name=/img[name].[ext]',
      //   options: {
      //     name(resourcePath, resourceQuery) {
      //       return '[name].[ext]'
      //     },
      //     outputPath: 'img',
      //   },
      // },
    ],
  },

  plugins: [
    new CleanWebpackPlugin(),

    new EnvironmentPlugin({
      NODE_ENV: 'production',
      DEBUG: false,
      API_URL: 'https://api.issuenote.app/',
    }),

    new MiniCssExtractPlugin({
      filename: 'assets/css/[name].[contenthash].css',
      chunkFilename: 'assets/css/[id].[contenthash].css',
    }),

    // copy plugin
    // new CopyWebpackPlugin({
    //   patterns: [
    //     { from: 'assets', to: 'public' },
    //   ],
    // }),

    // new MiniCssExtractPlugin({
    //   filename: '[hash].css',
    //   disable: !isProduction,
    // }),

    // new HtmlWebpackPlugin({
    //   template: './assets/index.html',
    //   title: 'strum chat title',
    //   favicon: './assets/logo.svg',
    // }),

    new HtmlWebpackPlugin({
      filename: 'app.html',
      template: './src/assets/app.html',
      minify: {
        minifyJS: true,
        minifyCSS: true,
        removeComments: true,
        useShortDoctype: true,
        collapseWhitespace: true,
        collapseInlineTagWhitespace: true,
      },
      favicon: './src/assets/logo.svg',
      title: 'issuenote',
      meta: {
        title: 'issuenote',
        description: 'issuenote',
        // keywords: Array.isArray(package.keywords)
        //   ? package.keywords.join(',')
        //   : undefined,
      },
    }),

    // copy plugin
    // new CopyWebpackPlugin({
    //   patterns: [
    //     { from: 'html/*', to: 'public' },
    //   ],
    // }),
  ],

  optimization: {
    chunkIds: 'named',
    splitChunks: {
      // name: true, //! error
      cacheGroups: {
        commons: {
          chunks: 'initial',
          minChunks: 2,
        },
        vendors: {
          test: /[\\/]node-modules[\\/]/,
          chunks: 'all',
          filename: isProduction
            ? '[name].[contenthash].js'
            : '[name].[hash].js',
          priority: -10,
        },
      },
    },
    runtimeChunk: 'multiple',
    minimize: true,
    // https://webpack.js.org/configuration/devtool/
    // devtool: 'hidden-source-map',
  },
  node: {
    // workaround for webpack-dev-server issue
    // https://github.com/webpack/webpack-dev-server/issues/60#issuecomment-103411179
    fs: 'empty',
    net: 'empty',
  },
})
