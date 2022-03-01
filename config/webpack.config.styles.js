const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { publicUrlOrPath, src, postCSS } = require('./constants');

module.exports = function (cssOptions, preProcessor) {
  const isProduction = process.argv.mode === 'production';

  const getStyleLoaders = (cssOptions, preProcessor) => {
    const loaders = [
      !isProduction ? 'style-loader' : {
        loader: MiniCssExtractPlugin.loader,
        // css is located in `static/css`, use '../../' to locate index.html folder
        // in production `paths.publicUrlOrPath` can be a relative path
        options: publicUrlOrPath.startsWith('.')
          ? {
              publicPath: (resourcePath, context) => {
                return path.relative(path.dirname(resourcePath), context) + '/';
              },
            }
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
            config: postCSS,
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
};
