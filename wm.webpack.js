'use strict'

/* nodes && variables */
const webpackEnv = process.env.NODE_ENV
const webpackAction = process.env.NODE_ACTION
const config = require('./config/config')
const webpackUtils = require('./src/utils/webpack.utils')
const filesystemUtils = require('./src/utils/filesystem.utils')

/* webpack (modules, plugins, ...) configuration */
const webpack = require('webpack')
const CopyWebpackPlugin = require('copy-webpack-plugin')

const webpackConfig = {
  mode: webpackEnv,
  devtool: webpackUtils.getWebpackDevtoolProperty(webpackAction, webpackEnv),
  entry: config.app.entryPoint,
  output: {
    path: webpackEnv === 'production' ? config.app.path.build : config.app.path.public,
    filename: 'dist/js/[name].js',
    chunkFilename: 'dist/js/[id].chunk.js',
    publicPath: '/'
  },
  resolve: {
    extensions: config.webpack.commonSettings.extensionFileResolver
  },
  module: {
    rules: config.webpack.commonSettings.rules
  },
  plugins: []
}

/* Generation de la configuration */
if (webpackAction === 'devserver') {
  const HOST = process.env.HOST
  const PORT = process.env.PORT && Number(process.env.PORT)

  Object.assign(webpackConfig, {
    devServer: {
      historyApiFallback: true,
      contentBase: config.app.path.public + '/',
      compress: true,
      hot: true,
      clientLogLevel: 'warning',
      host: HOST || config.webpack.devServer.config.host,
      port: PORT || config.webpack.devServer.config.port,
      open: config.webpack.devServer.config.autoOpenBrowser,
      overlay: config.webpack.devServer.config.errorOverlay
        ? { warnings: false, errors: true }
        : false,
      proxy: config.webpack.devServer.config.proxyTable,
      quiet: true,
      watchOptions: {
        poll: config.webpack.devServer.config.poll
      }
    }
  })

  /* Update module rules list */
  webpackConfig.module.rules.push(
    {
      test: /\.(scss|css)$/,
      use: [
        'style-loader',
        {
          loader: 'css-loader',
          options: {
            modules: {
              localIdentName: '[local]'
            },
            importLoaders: 1,
            url: true,
            sourceMap: true
          }
        },
        {
          loader: 'postcss-loader',
          options: {
            sourceMap: true
          }
        },
        {
          loader: 'sass-loader',
          options: {
            sourceMap: true
          }
        }
      ]
    },
    {
      test: /\.(jpg|jpeg|gif|png|svg|webp)$/,
      use: [
        {
          loader: 'file-loader',
          options: {
            publicPath: '/dist/',
            name: 'img/[name].[ext]',
            limit: 8192
          }
        },
        { loader: 'image-webpack-loader' },
        { loader: 'url-loader' }
      ]
    },
    {
      test: /\.(ttf|eot|svg|gif|woff|woff2)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
      use: [
        {
          loader: 'file-loader',
          options: {
            publicPath: '/dist/',
            name: 'fonts/[name].[ext]'
          }
        }
      ]
    }
  )

  /* Update plugins list */
  webpackConfig.plugins.push(
    new webpack.HotModuleReplacementPlugin(),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: config.app.path.src + '/assets/img',
          to: config.app.path.public + '/dist/img',
          globOptions: {
            ignore: ['.*']
          }
        },
        {
          from: config.app.path.src + '/php',
          to: config.app.path.public + '/ajax',
          globOptions: {
            ignore: ['.*']
          }
        }
      ]
    })
  )
} else if (webpackAction === 'compile') {
  const WebpackNotifierPlugin = require('webpack-build-notifier')
  const { CleanWebpackPlugin } = require('clean-webpack-plugin')
  const MiniCssExtractPlugin = require('mini-css-extract-plugin')
  const SassLintPlugin = require('sass-lint-webpack')

  /* Update module rules list */
  webpackConfig.module.rules.push(
    {
      test: /\.(scss|css)$/,
      use: [
        {
          loader: MiniCssExtractPlugin.loader,
          options: {
            publicPath: 'dist/css/',
            esModule: false,
            modules: {
              namedExport: true
            }
          }
        },
        {
          loader: 'css-loader',
          options: {
            modules: {
              namedExport: false,
              localIdentName: '[local]'
            },
            importLoaders: 2,
            url: true,
            sourceMap: true
          }
        },
        'postcss-loader',
        'sass-loader'
      ]
    },
    {
      test: /\.(jpg|jpeg|gif|png|svg|webp)$/,
      use: [
        {
          loader: 'file-loader',
          options: {
            name: 'img/[name].[ext]',
            publicPath: '../',
            outputPath: './dist/',
            limit: 8192
          }
        },
        { loader: 'image-webpack-loader' }
      ]
    },
    {
      test: /\.(ttf|eot|svg|gif|woff|woff2)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
      use: [
        {
          loader: 'file-loader',
          options: {
            publicPath: '../',
            outputPath: './dist/',
            name: 'fonts/[name].[ext]'
          }
        }
      ]
    }
  )

  if (webpackEnv === 'production') {
    const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')
    const TerserPlugin = require('terser-webpack-plugin')
    const copyWebpackPluginPatterns = [
      {
        from: config.app.path.src + '/assets/img',
        to: config.app.path.build + '/dist/img',
        globOptions: {
          ignore: ['.*']
        }
      },
      {
        from: config.app.path.public + '/favicon.png',
        to: config.app.path.build,
        globOptions: {
          ignore: ['.*']
        }
      }
    ]

    filesystemUtils.getFileListInFolder(config.app.path.public, 'html').forEach((item) => {
      copyWebpackPluginPatterns.push({
        from: config.app.path.public + '/' + item,
        to: config.app.path.build,
        globOptions: {
          ignore: ['.*']
        }
      })
    })

    Object.assign(webpackConfig, {
      optimization: {
        minimizer: [
          new OptimizeCssAssetsPlugin({
            cssProcessorOptions: {
              map: {
                inline: false,
                annotation: true
              }
            }
          }),
          new TerserPlugin({
            parallel: true
          })
        ],
        splitChunks: {
          cacheGroups: {
            vendor: {
              test: /[\\/]node_modules[\\/](vue|vue-router|vuex|bootstrap)[\\/]/,
              name: 'vendor',
              chunks: 'all'
            }
          }
        }
      }
    })

    /* Update plugins list */
    webpackConfig.plugins.push(
      new CleanWebpackPlugin(),
      new CopyWebpackPlugin({
        patterns: copyWebpackPluginPatterns
      }),
      new webpack.ProgressPlugin(),
      new SassLintPlugin(),
      new MiniCssExtractPlugin({
        filename: 'dist/css/[name].css',
        ignoreOrder: true
      }),
      new WebpackNotifierPlugin({
        title: 'Webpack',
        alwaysNotify: true
      })
    )
  } else {
    Object.assign(webpackConfig, {
      optimization: {
        splitChunks: {
          cacheGroups: {
            vendor: {
              test: /[\\/]node_modules[\\/](vue|vue-router|vuex|bootstrap)[\\/]/,
              name: 'vendor',
              chunks: 'all'
            }
          }
        }
      }
    })

    /* Update plugins list */
    webpackConfig.plugins.push(
      new CleanWebpackPlugin({
        cleanOnceBeforeBuildPatterns: ['**/*', '!*.html', '!favicon.png', '!.gitignore']
      }),
      new CopyWebpackPlugin({
        patterns: [
          {
            from: config.app.path.src + '/assets/img',
            to: config.app.path.public + '/dist/img',
            globOptions: {
              ignore: ['.*']
            }
          },
          {
            from: config.app.path.src + '/php',
            to: config.app.path.public + '/ajax',
            globOptions: {
              ignore: ['.*']
            }
          }
        ]
      }),
      new webpack.ProgressPlugin(),
      new SassLintPlugin(),
      new MiniCssExtractPlugin({
        filename: 'dist/css/[name].css',
        ignoreOrder: true
      }),
      new WebpackNotifierPlugin({
        title: 'Webpack',
        alwaysNotify: true
      })
    )
  }
}

if (webpackAction === 'devserver') {
  const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
  const portfinder = require('portfinder')

  module.exports = new Promise((resolve, reject) => {
    portfinder.basePort = process.env.PORT || config.webpack.devServer.config.port
    portfinder.getPort((err, port) => {
      if (err) {
        reject(err)
      } else {
        // publish the new Port, necessary for e2e tests
        process.env.PORT = port
        // add port to devServer config
        webpackConfig.devServer.port = port

        // Add FriendlyErrorsPlugin
        webpackConfig.plugins.push(new FriendlyErrorsPlugin({
          compilationSuccessInfo: {
            messages: [`Your application is running here: http://${webpackConfig.devServer.host}:${port}`]
          },
          onErrors: config.webpack.devServer.notifyOnErrors
            ? webpackUtils.createNotifierCallback()
            : undefined
        }))

        resolve(webpackConfig)
      }
    })
  })
} else {
  module.exports = webpackConfig
}
