'use strict'
const path = require('path')
const config = require('../../config/config')

/**
 * Processes the data retrieved by the plugin FriendlyErrorsPlugin from webpack
 * @returns {(function(*, *): void)|*}
 */
exports.createNotifierCallback = () => {
  const notifier = require('node-notifier')
  const packageConfig = require('../../package.json')

  return (severity, errors) => {
    if (severity !== 'error') {
      return
    }

    const error = errors[0]

    notifier.notify({
      title: packageConfig.name === undefined ? 'Webpack error' : packageConfig.name,
      message: severity + ': ' + error.name,
      subtitle: error.file || '',
      icon: path.join(__dirname, '../../src/icons/failure.png')
    })
  }
}

/**
 * Get the value of the devtool parameter from the configuration file
 * @param webpackAction
 * @param webpackEnvironment
 * @returns {string}
 */
exports.getWebpackDevtoolProperty = (webpackAction, webpackEnvironment) => {
  if (webpackAction === 'devserver') {
    return config.webpack.devServer.config.devtool
  } else if (webpackAction === 'compile') {
    if (webpackEnvironment === 'production') {
      return config.webpack.compilationAssets.prod.devtool
    } else {
      return config.webpack.compilationAssets.dev.devtool
    }
  } else {
    return config.webpack.compilationAssets.dev.devtool
  }
}
