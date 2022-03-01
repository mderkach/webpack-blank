const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { publicUrlOrPath, src } = require('./constants');

module.exports = function (cssOptions, preProcessor) {
  const isDevelopment = process.argv.mode === 'development';
  const isProduction = process.argv.mode === 'production';

  const getStyleLoaders = (cssOptions, preProcessor) => {
    const loaders = [
      isDevelopment && 'style-loader',
      isProduction && {
        loader: MiniCssExtractPlugin.loader,
        // css is located in `static/css`, use '../../' to locate index.html folder
        // in production `paths.publicUrlOrPath` can be a relative path
        options: publicUrlOrPath.startsWith('.')
          ? { publicPath: '../../' }
          : {},
      },
      {
        loader: 'css-loader',
        options: cssOptions,
      },
      {
        loader: 'postcss-loader',
        options: {
          sourceMap: true,
          postcssOptions: {
            config:'./postcss.config.js',
          },
        },
      },
    ].filter(Boolean);
    if (preProcessor) {
      loaders.push(
        {
          loader: require.resolve('resolve-url-loader'),
          options: {
            sourceMap: true,
            root: src,
          },
        },
        {
          loader: require.resolve(preProcessor),
          options: {
            sourceMap: true,
          },
        }
      );
    }
    return loaders;
  };

  return getStyleLoaders(cssOptions, preProcessor);
}
