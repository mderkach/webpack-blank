const { merge } = require('webpack-merge');
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');
const BaseConfig = require('./webpack.config');
const { dist } = require('./constants');

const devWebpackConfig = merge(BaseConfig, {
  // DEV config
  mode: 'development',
  devtool: 'cheap-module-source-map',
  bail: true,
  output: {
    pathinfo: true,
  },
  devServer: {
    open: false,
    hot: false,
    static: {
      directory: dist,
    },
    port: 8080,
    historyApiFallback: true,
    client: {
      overlay: {
        errors: true,
        warnings: false,
      },
    },
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': '*',
      'Access-Control-Allow-Headers': '*',
    },
  },
  plugins: [
    new BrowserSyncPlugin(
      {
        host: 'localhost',
        port: 3000,
        proxy: 'http://localhost:8080/',
        notify: false,
      },
      {
        reload: false,
      }
    ),
  ].filter(Boolean),
});

module.exports = new Promise((resolve) => {
  resolve(devWebpackConfig);
});
