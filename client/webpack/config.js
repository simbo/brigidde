const ExtractTextPlugin = require('extract-text-webpack-plugin');

const { IS_PRODUCTION } = require('./env');
const { paths } = require('./paths');
const { plugins } = require('./plugins');
const { loaders } = require('./loaders');

const watchOptions = {
  poll: true,
  ignored: /node_modules/
};

const config = {
  context: paths.root(),

  entry: {
    main: paths.src('main.ts'),
    polyfills: paths.src('polyfills.ts')
  },

  resolve: {
    alias: {},
    extensions: ['.js', '.ts'],
    modules: [paths.root('node_modules')]
  },

  output: {
    path: paths.dist(),
    filename: `scripts/[name]${IS_PRODUCTION ? '.[chunkhash]' : ''}.js`,
    sourceMapFilename: `scripts/[name]${IS_PRODUCTION ? '.[chunkhash]' : ''}.js.map`,
    chunkFilename: `scripts/[id]${IS_PRODUCTION ? '.[chunkhash]' : ''}.chunk.js`
  },

  devtool: IS_PRODUCTION ? 'source-map' : 'cheap-module-eval-source-map',

  watchOptions,

  devServer: {
    host: '0.0.0.0',
    port: 9000,
    contentBase: paths.src(),
    clientLogLevel: 'warning',
    historyApiFallback: true,
    compress: true,
    hot: true,
    hotOnly: false,
    proxy: [
      {
        context: [
          '/**',
          '!/index.html',
          '!/scripts/**',
          '!/styles/**',
          '!/assets/**',
          '!/terminal'
        ],
        target: `${process.env.APP_HTTP_SECURE === 'true' ? 'https' : 'http'}://server:${
          process.env.APP_HTTP_PORT
        }`
      }
    ],
    watchOptions
  },

  module: {
    rules: [
      // typescript rules
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: ['ts-loader', 'angular2-template-loader']
      },

      // json rules
      {
        test: /\.json$/,
        exclude: /node_modules/,
        use: ['json-loader']
      },

      // component style rules
      {
        test: /\.styl$/,
        use: ['to-string-loader', 'css-loader', loaders.postcss, loaders.stylus],
        exclude: [/node_modules/, paths.src('styles')]
      },

      // global style rules
      {
        test: /\.styl$/,
        use: ExtractTextPlugin.extract({
          use: ['css-loader?sourceMap', loaders.postcss, loaders.stylus]
        }),
        exclude: [/node_modules/, paths.src('modules')]
      },

      // pug rules
      {
        test: /\.pug$/,
        use: ['raw-loader', loaders.pugHtml],
        exclude: /node_modules|terminal-commands\/lib/
      }
    ]
  },

  plugins
};

module.exports = { config };
