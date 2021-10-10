const path = require('path')

module.exports = {
  app: {
    path: {
      src: path.resolve(__dirname, '../src'),
      build: path.resolve(__dirname, '../build'),
      public: path.resolve(__dirname, '../public')
    },
    entryPoint: {
      main: path.resolve(__dirname, '../src/main.js')
    }
  },
  webpack: {
    commonSettings: {
      rules: [
        {
          enforce: 'pre',
          test: /\.(js|jsx|vue)$/,
          exclude: /node_modules/,
          loader: 'eslint-loader',
          options: {
            formatter: require('eslint-friendly-formatter'),
            emitWarning: false
          }
        },
        {
          test: /\.(js|jsx)$/,
          exclude: /(node_modules|bower_components)/,
          use: ['babel-loader']
        },
        {
          test: /\.vue$/,
          loader: 'vue-loader'
        }
      ],
      extensionFileResolver: ['.js', '.jsx', '.css', '.json', '.ejs', '.web', '.vue']
    },
    devServer: {
      config: {
        proxyTable: {},
        host: 'localhost',
        port: 8080,
        autoOpenBrowser: false,
        errorOverlay: true,
        notifyOnErrors: true,
        poll: false,
        useEslint: true,
        showEslintErrorsInOverlay: true,
        devtool: 'cheap-module-source-map',
        cacheBusting: true,
        cssSourceMap: true
      }
    },
    compilationAssets: {
      dev: {
        devtool: 'cheap-module-source-map'
      },
      prod: {
        devtool: 'source-map'
      }
    }
  }
}
