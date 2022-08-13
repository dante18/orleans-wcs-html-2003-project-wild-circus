'use strict'

/* ------------------------------------------- Start import project dependencies ------------------------------------------- */

/* ------------------------------------------- Node js modules ------------------------------------------- */
const path = require('path')
const fs = require('fs')

/* ------------------------------------------- end node js modules ------------------------------------------- */

/* ------------------------------------------- Webpack plugins ------------------------------------------- */
const webpack = require('webpack')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const FriendlyErrorsWebpackPlugin = require('@soda/friendly-errors-webpack-plugin')

/* ------------------------------------------- end webpack plugins ------------------------------------------- */

/* ------------------------------------------- End import project dependencies ------------------------------------------- */

/* --------------------------------------------- Start function support --------------------------------------------- */
/**
 * Extract the information passed in parameter
 *
 * @param {string} parameterToRetrieve search parameter
 *
 * @returns {undefined|string} parameter value
 */
function getParameter (parameterToRetrieve) {
  const environmentVariablesList = process.env.NODE_ENV.split(':')

  if (parameterToRetrieve === 'action') {
    return environmentVariablesList[0]
  } else if (parameterToRetrieve === 'env') {
    return environmentVariablesList[1]
  }
}

/**
 * list the contents of a folder
 *
 * @param {string} folder folder path
 *
 * @returns {*[]} returns the list of files and folders/subfolders
 */
function scanFolder (folder) {
  const contentPath = fs.readdirSync(folder)
  const Files = []

  for (let i = 0; i < contentPath.length; i++) {
    const parts = contentPath[i].split('.')
    const name = parts[0]
    const extension = parts[1]

    Files.push(name + '.' + extension)
  }

  return Files
}

/* --------------------------------------------- End function support --------------------------------------------- */

/* --------------------------------------------- Start main programm --------------------------------------------- */

/* ------------------------------------------ Variables ------------------------------------------ */
const environment = getParameter('env') === undefined ? 'dev' : getParameter('env')
const action = getParameter('action') === undefined ? 'unknown' : getParameter('action')
const sourceAppFolder = path.resolve(__dirname, 'src')
const webpackBuildFolder = path.resolve(__dirname, 'build')
const webpackDevServerRootFolder = path.resolve(__dirname, 'public')

const webpackRules = [
  {
    enforce: 'pre',
    test: /\.(js|jsx|ts|tsx)$/,
    exclude: /node_modules/,
    loader: 'eslint-loader',
    options: {
      formatter: require('eslint-friendly-formatter'),
      emitWarning: false
    }
  },
  {
    test: /\.(js|jsx|ts|tsx)$/,
    exclude: /(node_modules|bower_components)/,
    use: ['babel-loader']
  },
  {
    test: /\.(ts|tsx)$/,
    loader: 'ts-loader',
    options: {
      transpileOnly: true
    },
    exclude: /node_modules/
  }
]
const webpackPlugins = [
  new FriendlyErrorsWebpackPlugin({
    clearConsole: true
  })
]
const webpackDefaultConfig = {
  mode: environment === 'prod' ? 'production' : 'development',
  devtool: environment === 'prod' ? 'source-map' : 'cheap-module-source-map',
  entry: {
    main: sourceAppFolder + '/main.js'
  },
  output: {
    path: environment === 'prod' ? webpackBuildFolder : webpackDevServerRootFolder,
    filename: 'dist/js/[name].js',
    chunkFilename: 'dist/js/[id].chunk.js',
    publicPath: '/'
  },
  resolve: {
    extensions: ['.js', '.jsx', '.css', '.json', '.ejs', '.web', '.tsx', '.ts']
  },
  module: {
    rules: webpackRules
  },
  plugins: webpackPlugins
}
/* ------------------------------------------ End variables ------------------------------------------ */

if (action === 'serve') {
  // add webpack dev server config
  Object.assign(webpackDefaultConfig, {
    devServer: {
      historyApiFallback: true,
      compress: true,
      hot: true,
      host: 'local-ipv4',
      port: 3000,
      open: true,
      static: {
        directory: webpackDevServerRootFolder,
        publicPath: '/',
        serveIndex: false,
        watch: {
          usePolling: false
        }
      },
      client: {
        logging: 'warn',
        progress: true,
        overlay: {
          errors: true,
          warnings: false
        }
      }
    }
  })

  // add rules used to manage css and scss file
  webpackDefaultConfig.module.rules.push({
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
  })

  // add rules used to manage image file
  webpackDefaultConfig.module.rules.push({
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
  })

  // add rules used to manage font file
  webpackDefaultConfig.module.rules.push({
    test: /\.(ttf|eot|svg|gif|woff|woff2)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
    use: [
      {
        loader: 'file-loader',
        options: {
          publicPath: './',
          name: 'fonts/[name].[ext]'
        }
      }
    ]
  })

  // update plugins configuration
  webpackDefaultConfig.plugins.push(new webpack.HotModuleReplacementPlugin())
  webpackDefaultConfig.plugins.push(new CopyWebpackPlugin({
    patterns: [
      {
        from: sourceAppFolder + '/assets/img',
        to: webpackDevServerRootFolder + '/dist/img',
        globOptions: {
          ignore: ['.*']
        }
      }
    ]
  }))
} else if (action === 'compile') {
  const { CleanWebpackPlugin } = require('clean-webpack-plugin')
  const MiniCssExtractPlugin = require('mini-css-extract-plugin')
  const SassLintPlugin = require('sass-lint-webpack')
  const WebpackNotifierPlugin = require('webpack-notifier')

  // update webpack default configuration
  if (environment === 'prod') {
    const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')
    const TerserPlugin = require('terser-webpack-plugin')

    // update webpack configuration
    Object.assign(webpackDefaultConfig, {
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
              test: /[\\/]node_modules[\\/](bootstrap)[\\/]/,
              name: 'vendor',
              chunks: 'all'
            }
          }
        }
      }
    })

    // update plugins configuration
    const copyWebpackPluginPatterns = [
      {
        from: sourceAppFolder + '/assets/img',
        to: webpackBuildFolder + '/dist/img',
        globOptions: {
          ignore: ['.*']
        }
      },
      {
        from: webpackDevServerRootFolder + '/favicon.png',
        to: webpackBuildFolder,
        globOptions: {
          ignore: ['.*']
        }
      }
    ]
    scanFolder(webpackDevServerRootFolder).forEach((item) => {
      if (item.includes('.html')) {
        copyWebpackPluginPatterns.push({
          from: webpackDevServerRootFolder + '/' + item,
          to: webpackBuildFolder,
          globOptions: {
            ignore: ['.*']
          }
        })
      }
    })

    webpackDefaultConfig.plugins.push(new CleanWebpackPlugin())
    webpackDefaultConfig.plugins.push(new CopyWebpackPlugin({
      patterns: copyWebpackPluginPatterns
    }))
    webpackDefaultConfig.plugins.push(new webpack.ProgressPlugin())
    webpackDefaultConfig.plugins.push(new SassLintPlugin())
    webpackDefaultConfig.plugins.push(new MiniCssExtractPlugin({
      filename: 'dist/css/[name].css',
      ignoreOrder: true
    }))
  } else {
    // update webpack configuration
    Object.assign(webpackDefaultConfig, {
      optimization: {
        splitChunks: {
          cacheGroups: {
            vendor: {
              test: /[\\/]node_modules[\\/](bootstrap)[\\/]/,
              name: 'vendor',
              chunks: 'all'
            }
          }
        }
      }
    })

    // update plugins configuration
    webpackDefaultConfig.plugins.push(new CleanWebpackPlugin({
      cleanOnceBeforeBuildPatterns: ['**/*', '!*.html', '!favicon.png', '!.gitignore']
    }))
    webpackDefaultConfig.plugins.push(new CopyWebpackPlugin({
      patterns: [
        {
          from: sourceAppFolder + '/assets/img',
          to: webpackDevServerRootFolder + '/dist/img',
          globOptions: {
            ignore: ['.*']
          }
        }
      ]
    }))
    webpackDefaultConfig.plugins.push(new webpack.ProgressPlugin())
    webpackDefaultConfig.plugins.push(new SassLintPlugin())
    webpackDefaultConfig.plugins.push(new MiniCssExtractPlugin({
      filename: 'dist/css/[name].css',
      ignoreOrder: true
    }))
  }

  // update plugins configuration
  webpackDefaultConfig.plugins.push(new WebpackNotifierPlugin({
    title: (params) => {
      return `Build status is ${params.status} with message ${params.message}`
    },
    contentImage: {
      success: path.join(__dirname, 'resources/icons/success.png'),
      warning: path.join(__dirname, 'resources/icons/warning.png'),
      error: path.join(__dirname, 'resources/icons/failure.png')
    }
  }))

  // add rules used to manage css and scss file
  webpackDefaultConfig.module.rules.push({
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
  })

  // add rules used to manage image file
  webpackDefaultConfig.module.rules.push({
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
  })

  // add rules used to manage font file
  webpackDefaultConfig.module.rules.push({
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
  })
} else {
  console.log('action unknown')
}

if (action === 'serve') {
  const portfinder = require('portfinder')

  module.exports = new Promise((resolve, reject) => {
    portfinder.basePort = 3000

    portfinder.getPort((error, port) => {
      if (error) {
        reject(error)
      } else {
        webpackDefaultConfig.devServer.port = port

        resolve(webpackDefaultConfig)
      }
    })
  })
} else {
  module.exports = webpackDefaultConfig
}

/* --------------------------------------------- End main programm --------------------------------------------- */
