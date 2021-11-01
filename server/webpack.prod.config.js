const path = require('path')

const webpack = require('webpack')

const WebpackNodeExternals = require('webpack-node-externals')
const ReloadServerPlugin = require('reload-server-webpack-plugin')

const cwd = process.cwd()

module.exports = {
  mode: 'production',
  devtool: 'cheap-eval-source-map',
  entry: {
    server: [
      // 'webpack/hot/poll?1000',
      './src/index.ts',
    ],
  },
  output: {
    path: path.resolve('build'),
    filename: 'quda-server.js',
    // https://github.com/webpack/webpack/pull/8642
    futureEmitAssets: true,
  },
  watch: false,
  target: 'node',
  externals: [
    WebpackNodeExternals({
      whitelist: ['webpack/hot/poll?1000'],
    }),
  ],
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.json', '.mjs'],
    alias: {
      src: path.resolve(__dirname, './src'),
      '@protocols': path.resolve(__dirname, '../protocols'),
      '@graphql': path.resolve(__dirname, './src/graphql'),
      '@modules': path.resolve(__dirname, './modules'),
      '@middlewares': path.resolve(__dirname, './src/middlewares'),
      config: path.resolve(__dirname, './config'),
      protocols: path.resolve(__dirname, '../protocols'),
    },
  },
  node: {
    global: false,
    __dirname: true,
  },
  module: {
    rules: [
      {
        test: /\.mjs$/,
        include: /node_modules/,
        type: 'javascript/auto',
      },
      {
        test: /\.(js|jsx|ts|tsx)?$/,
        use: {
          loader: 'ts-loader',
        },
        exclude: [/node_modules/],
        include: [path.join(cwd, 'src'), path.join(cwd, '../')],
      },
      {
        test: /\.(graphql|gql)$/,
        exclude: /node_modules/,
        loader: 'graphql-tag/loader',
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production'),
    }),
  ],
}
