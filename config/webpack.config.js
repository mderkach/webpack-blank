const path = require('path');
const fs = require('fs');
const resolve = require('resolve');
const CopyPlugin = require('copy-webpack-plugin');
const getCSSModuleLocalIdent = require('react-dev-utils/getCSSModuleLocalIdent');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const SpriteLoaderPlugin = require('svg-sprite-loader/plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');
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
const tsConfigRaw = require('../tsconfig.json');

const env = getClientEnvironment(publicUrlOrPath.slice(0, -1));

// style files regexes
// const cssRegex = /\.css$/;
// const cssModuleRegex = /\.module\.css$/;
// const sassRegex = /\.(scss|sass)$/;
const sassModuleRegex = /\.module\.(scss|sass)$/;

module.exports = {
  target: ['browserslist'],
  entry: {
    app: entry,
  },
  output: {
    path: dist,
    filename: './assets/js/[name].[fullhash:8].js',
    chunkFilename: './assets/js/[name].[fullhash:8].chunk.js',
    publicPath: 'auto',
    clean: true,
    assetModuleFilename: (module) => {
      let { filename } = module;
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
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'esbuild-loader',
        options: {
          loader: 'tsx',
          target: 'es2017',
          tsconfigRaw: tsConfigRaw,
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
        test: /\.(gif|png|jpe?g|webp)$/i,
        type: 'asset',
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
      },
      {
        test: /\.(ttf|eot|woff|woff2)$/,
        type: 'asset/resource',
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
    new HtmlWebpackPlugin({
      title: 'app',
      template: `${src}/index.html`,
      minify: {
        collapseWhitespace: true,
      },
      inject: false,
    }),
    new ForkTsCheckerWebpackPlugin({
      async: false,
      typescript: {
        typescriptPath: resolve.sync('typescript', {
          basedir: nodeModules,
        }),
        configOverwrite: {
          compilerOptions: {
            sourceMap: true,
            skipLibCheck: true,
            inlineSourceMap: false,
            declarationMap: false,
            noEmit: true,
            incremental: true,
            tsBuildInfoFile,
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
      failOnError: true,
      context: src,
      cache: true,
      fix: true,
      threads: true,
      cacheLocation: path.resolve(nodeModules, '.cache/.eslintcache'),
      cwd: appPath,
      resolvePluginsRelativeTo: __dirname,
    }),
    new CopyPlugin({
      patterns: [
        {
          from: 'src/assets/**/*',
          to({ context, absoluteFilename }) {
            const folderName = absoluteFilename
              .substring(absoluteFilename.indexOf('src/'), absoluteFilename.lastIndexOf('/'))
              .replace('src/', '');
            return `${folderName}/[name][ext]`;
          },
        },
      ],
      options: { concurrency: 1000 },
    }),
  ],
};
