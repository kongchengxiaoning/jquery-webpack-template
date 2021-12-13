const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const paths = require('./paths')

// HtmlWebpackPlugin
const multiplePagePlugins = (configs) => {
  const plugins = []
  const keys = Object.keys(configs.entry)
  keys.forEach((item) => {
    plugins.push(
      new HtmlWebpackPlugin({
        template:  `${paths.src}/views/${item}.html`,
        filename: `${item}.html`,
        chunks: [item]
      })
    )
  })
  return plugins
}

const commonConfig = {
  // Where webpack looks to start building the bundle
  entry: {
    index: paths.src + '/assets/scripts/index.js',
    list: paths.src + '/assets/scripts/list.js'
  },

  // Where webpack outputs the assets and bundles
  output: {
    path: paths.build,
    filename: '[name].bundle.js',
    publicPath: '/'
  },

  // Customize the webpack build process
  plugins: [
    // Removes/cleans build folders and unused assets when rebuilding
    new CleanWebpackPlugin(),

    // Copies files from target to destination folder
    new CopyWebpackPlugin({
      patterns: [
        {
          from: paths.public,
          to: 'assets',
          globOptions: {
            ignore: ['*.DS_Store']
          },
          noErrorOnMissing: true
        }
      ]
    })
  ],

  // Determine how modules within the project are treated
  module: {
    rules: [
      // JavaScript: Use Babel to transpile JavaScript files
      { test: /\.js$/, use: ['babel-loader'] },

      // Images: Copy image files to build folder
      { test: /\.(?:ico|gif|png|jpg|jpeg)$/i, type: 'asset/resource' },

      // Fonts and SVGs: Inline files
      { test: /\.(woff(2)?|eot|ttf|otf|svg|)$/, type: 'asset/inline' },

      // Html: img require('')
      { test: /\.html$/i, use: ['html-loader'] }
    ]
  },

  // resolve configuration options
  resolve: {
    modules: [paths.src, 'node_modules'],
    extensions: ['.js', '.jsx', '.json'],
    alias: {
      '@': paths.src
    }
  }
}

// Generates an HTML file from a template
// Generates deprecation warning: https://github.com/jantimon/html-webpack-plugin/issues/1501
commonConfig.plugins.push(...multiplePagePlugins(commonConfig))

module.exports = commonConfig
