const path = require('path');
const fs = require('fs');
const resolve = require('resolve');
const getCSSModuleLocalIdent = require('react-dev-utils/getCSSModuleLocalIdent');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const SpriteLoaderPlugin = require('svg-sprite-loader/plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');
const { ESBuildMinifyPlugin } = require('esbuild-loader');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const {
  src,
  dist,
  assets,
  webpackCache,
  jsConfig,
  tsConfig,
  publicUrlOrPath,
  moduleFileExtensions,
  nodeModules,
  appPath,
  tsBuildInfoFile,
  entry,
} = require('./constants');
const modules = require('./webpack.config.modules');
const styleLoaders = require('./webpack.config.styles');
const createEnvironmentHash = require('./webpack.config.cache');
const getClientEnvironment = require('./webpack.config.env');
const env = getClientEnvironment(publicUrlOrPath.slice(0, -1));

// style files regexes
// const cssRegex = /\.css$/;
// const cssModuleRegex = /\.module\.css$/;
// const sassRegex = /\.(scss|sass)$/;
const sassModuleRegex = /\.module\.(scss|sass)$/;

module.exports = function () {
  const isDevelopment = process.argv.mode === 'development';
  const isProduction = process.argv.mode === 'production';

  return {
    target: ['browserslist'],
    mode: isProduction ? 'production' : 'development',
    bail: isProduction,
    entry: {
      app: entry,
    },
    output: {
      path: dist,
      pathinfo: isDevelopment,
      filename: isProduction ? `$./js/[name].[hash:8].js` : `./js/bundle.js`,
      // There are also additional JS chunk files if you use code splitting.
      chunkFilename: isProduction ? `./js/[name].[contenthash:8].chunk.js` : `./js/[name].chunk.js`,
      publicPath: 'auto',
      clean: true,
      assetModuleFilename: (module) => {
        let filename = module.filename;
        if (module.filename.includes('src/')) {
          filename = module.filename.replace('src/', '');
        }
        return filename;
      },
    },
    cache: {
      type: 'filesystem',
      version: createEnvironmentHash(env.raw),
      cacheDirectory: webpackCache,
      store: 'pack',
      buildDependencies: {
        defaultWebpack: ['webpack/lib/'],
        config: [__filename],
        tsconfig: [tsConfig, jsConfig].filter((f) => fs.existsSync(f)),
      },
    },
    infrastructureLogging: {
      level: 'none',
    },
    resolve: {
      extensions: moduleFileExtensions.map((ext) => `.${ext}`),
      modules: ['node_modules', nodeModules].concat(modules.additionalModulePaths || []),
    },
    watchOptions: {
      ignored: /node_modules/,
    },
    devtool: isProduction ? 'source-map' : 'eval-cheap-module-source-map',
    devServer: {
      open: true,
      hot: false,
      static: {
        directory: dist,
      },
      port: 3000,
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
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          loader: 'esbuild-loader',
          options: {
            loader: 'tsx',
            target: 'es2017',
            tsconfigRaw: require('../tsconfig.json'),
          },
        },
        {
          test: /\.jsx?$/,
          loader: 'esbuild-loader',
          options: {
            loader: 'jsx',
            target: 'es2017',
          },
        },
        {
          test: /\.(pdf|jpg|png|gif|ico)$/,
          type: 'asset/resource',
          dependency: {
            not: `${src}/static`,
          },
          exclude: `${src}/static`,
        },
        {
          test: /\.(svg)$/,
          // type: 'asset/resource',
          use: [
            {
              loader: 'svg-sprite-loader',
              options: {
                extract: true,
                publicPath: `${assets}/img/svg/`,
                spriteFilename: 'sprite.svg',
              },
            },
            {
              loader: 'svgo-loader',
              options: {
                plugins: [
                  'removeDoctype',
                  'removeXMLProcInst',
                  'removeComments',
                  'removeMetadata',
                  'removeEditorsNSData',
                  'cleanupAttrs',
                  'mergeStyles',
                  'inlineStyles',
                  'minifyStyles',
                  'cleanupIDs',
                  'removeUselessDefs',
                  'cleanupNumericValues',
                  'convertColors',
                  'removeUnknownsAndDefaults',
                  'removeNonInheritableGroupAttrs',
                  'removeUselessStrokeAndFill',
                  'removeViewBox',
                  'cleanupEnableBackground',
                  'removeHiddenElems',
                  'removeEmptyText',
                  'convertShapeToPath',
                  'convertEllipseToCircle',
                  'moveElemsAttrsToGroup',
                  'moveGroupAttrsToElems',
                  'collapseGroups',
                  'convertPathData',
                  'convertTransform',
                  'removeEmptyAttrs',
                  'removeEmptyContainers',
                  'mergePaths',
                  'removeUnusedNS',
                  'sortDefsChildren',
                  'removeTitle',
                  'removeDesc',
                ],
              },
            },
            'svg-transform-loader',
          ],
          exclude: `${src}/static`,
        },
        {
          test: /\.(ttf|eot|woff|woff2)$/,
          type: 'asset/resource',
          exclude: `${src}/static`,
          dependency: {
            not: `${src}/static`,
          },
        },
        {
          test: sassModuleRegex,
          use: styleLoaders(
            {
              importLoaders: 3,
              sourceMap: true,
              modules: {
                mode: 'local',
                getLocalIdent: getCSSModuleLocalIdent,
              },
            },
            'sass-loader'
          ),
        },
      ],
    },
    plugins: [
      new SpriteLoaderPlugin({ plainSprite: true }),
      isProduction && new MiniCssExtractPlugin({
        filename: `./css/[name].[hash:8].css`,
        chunkFilename: `./css/[name]-chunk.[hash:8].css`,
      }),
      new HtmlWebpackPlugin({
        title: 'app',
        template: `${src}/index.html`,
        minify: {
          collapseWhitespace: true,
        },
        inject: false,
      }),
      new ForkTsCheckerWebpackPlugin({
        async: isDevelopment,
        typescript: {
          typescriptPath: resolve.sync('typescript', {
            basedir: nodeModules,
          }),
          configOverwrite: {
            compilerOptions: {
              sourceMap: isProduction,
              skipLibCheck: true,
              inlineSourceMap: false,
              declarationMap: false,
              noEmit: true,
              incremental: true,
              tsBuildInfoFile: tsBuildInfoFile,
            },
          },
          context: appPath,
          diagnosticOptions: {
            syntactic: true,
          },
          mode: 'write-references',
        },
        issue: {
          include: [{ file: '../**/src/**/*.{ts,tsx}' }, { file: '**/src/**/*.{ts,tsx}' }],
          exclude: [
            { file: '**/src/**/__tests__/**' },
            { file: '**/src/**/?(*.){spec|test}.*' },
            { file: '**/src/setupProxy.*' },
            { file: '**/src/setupTests.*' },
          ],
        },
        logger: {
          infrastructure: 'silent',
        },
      }),
      new ESLintPlugin({
        // Plugin options
        extensions: ['js', 'mjs', 'jsx', 'ts', 'tsx'],
        formatter: require.resolve('react-dev-utils/eslintFormatter'),
        eslintPath: require.resolve('eslint'),
        failOnError: !isDevelopment,
        context: src,
        cache: true,
        fix: true,
        threads: true,
        cacheLocation: path.resolve(nodeModules, '.cache/.eslintcache'),
        // ESLint class options
        cwd: appPath,
        resolvePluginsRelativeTo: __dirname,
        baseConfig: {
          extends: [require.resolve('eslint-config-react-app/base')],
        },
      }),
    ].filter(Boolean),
    optimization: {
      minimizer: [
        new ESBuildMinifyPlugin({
          target: 'es2015',
          minify: true,
          sourcemap: true,
        }),
        new CssMinimizerPlugin({
          parallel: true,
          minify: CssMinimizerPlugin.cssnanoMinify,
          minimizerOptions: {
            preset: [
              'default',
              {
                discardComments: { removeAll: true },
              },
            ],
            processorOptions: {
              parser: 'postcss-scss',
            },
            options: {
              sourceMap: true,
            },
          },
        }),
      ],
    },
  };
};
