const path = require('path');
const fs = require('fs');
const getPublicUrlOrPath = require('react-dev-utils/getPublicUrlOrPath');

const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = relativePath => path.resolve(appDirectory, relativePath);

const publicUrlOrPath = getPublicUrlOrPath(
  process.env.NODE_ENV === 'development',
  // eslint-disable-next-line import/no-dynamic-require
  require(resolveApp('package.json')).homepage,
  process.env.PUBLIC_URL ?? '.'
);

const moduleFileExtensions = [
  'js',
  'ts',
  'tsx',
  'json',
  'jsx',
];

// Resolve file paths in the same order as webpack
const resolveModule = (resolveFn, filePath) => {
  // eslint-disable-next-line no-shadow
  const extension = moduleFileExtensions.find(extension =>
    fs.existsSync(resolveFn(`${filePath}.${extension}`))
  );

  if (extension) {
    return resolveFn(`${filePath}.${extension}`);
  }

  return resolveFn(`${filePath}.js`);
};

module.exports = {
  appPath: resolveApp('.'),
  src: resolveApp('src'),
  dist: resolveApp('dist'),
  entry: resolveModule(resolveApp, 'src/index'),
  assets: resolveApp('assets'),
  dotenv: resolveApp('.env'),
  package: resolveApp('package.json'),
  nodeModules: resolveApp('node_modules'),
  swSrc: resolveModule(resolveApp, 'src/service-worker'),
  tsConfig: resolveApp('tsconfig.json'),
  jsConfig: resolveApp('jsconfig.json'),
  webpackCache: resolveApp('node_modules/.cache'),
  tsBuildInfoFile: resolveApp('node_modules/.cache/tsconfig.tsbuildinfo'),
  postCSS: resolveModule(resolveApp, 'config/postcss.config'),
  publicUrlOrPath,
};



module.exports.moduleFileExtensions = moduleFileExtensions;
