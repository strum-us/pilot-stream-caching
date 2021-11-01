const CssNano = require('cssnano')
const { EnvironmentPlugin } = require('webpack')

const path = require('path')
const outPath = path.join(__dirname, './app-build')
// webpack.config.js
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = {
  stats: {
    children: true,
    errorDetails: true,
  },
  mode: 'development',
  entry: {
    app: './src/.entrypoint/app/index.tsx',
    capture: './src/.entrypoint/capture/index.tsx',
    tray: './src/.entrypoint/tray/index.tsx',
    record: './src/.entrypoint/record/index.tsx',
  },
  target: 'electron-renderer',
  devtool: 'source-map',
  module: {
    rules: [
      // .ts, .tsx
      {
        test: /\.tsx?$/,
        use: [
          'babel-loader',
          'ts-loader',
          // { loader: 'ts-loader', options: { emitWarning: true } },
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
          outputPath: 'assets/img',
        },
      },
    ],
  },
  output: {
    path: outPath,
    filename: '[name].bundle.js',
    publicPath: './',
  },
  devServer: {
    historyApiFallback: true,
  },
  plugins: [
    new CleanWebpackPlugin(),
    new EnvironmentPlugin({
      NODE_ENV: 'production',
      DEBUG: false,
      API_URL: 'https://app.strum.us/api',
      IS_ELECTRON: true,
      IS_DEV: false,
    }),

    new MiniCssExtractPlugin({
      filename: 'assets/css/[name].[contenthash].css',
      chunkFilename: 'assets/css/[id].[contenthash].css',
    }),
    new HtmlWebpackPlugin({
      filename: 'app.html',
      template: './src/assets/app.html',
      chunks: ['app'],
    }),
    new HtmlWebpackPlugin({
      filename: 'capture.html',
      template: './src/assets/capture.html',
      chunks: ['capture'],
    }),
    new HtmlWebpackPlugin({
      filename: 'record.html',
      template: './src/assets/record.html',
      chunks: ['record'],
    }),
    new HtmlWebpackPlugin({
      filename: 'tray.html',
      template: './src/assets/tray.html',
      chunks: ['tray'],
    }),
  ],
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
    mainFields: ['module', 'browser', 'main'],
    modules: [
      'node_modules',
    ],
    alias: {
      '@': path.resolve(__dirname, 'src'),
      src: path.resolve(__dirname, 'src'),
      '@assets': path.resolve(__dirname, './src/assets'),
      '@containers': path.resolve(__dirname, './src/containers'),
      '@controllers': path.resolve(__dirname, './src/controllers'),
      '@pages': path.resolve(__dirname, './src/pages'),
      '@components': path.resolve(__dirname, './src/components'),
      '@middlewares': path.resolve(__dirname, './src/middlewares'),
      '@strum/doc-editor': path.resolve(__dirname, '../@strum/doc-editor/src/doc-editor'),
      '@strum/file-pack': path.resolve(__dirname, '../@strum/file-pack/'),
      '@modules/doc-editor': path.resolve(__dirname, '../@strum/doc-editor/src/doc-editor'),
      '@modules': path.resolve(__dirname, './src/modules'),
      '@protocols': path.resolve(__dirname, '../protocols'),
      config: path.resolve(__dirname, './src/config'),
    },
  },
}
