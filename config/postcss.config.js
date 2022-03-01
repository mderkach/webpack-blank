const autoprefixer = require('autoprefixer');
const combinemq = require('postcss-combine-media-query');
const removeDuplicates = require('postcss-discard-duplicates');
const mixins = require('postcss-mixins');
const cssnano = require('cssnano');
const nested = require('postcss-nested');
const flexbugs = require('postcss-flexbugs-fixes');
const preset = require('postcss-preset-env')
const normalize = require('postcss-normalize');

module.exports = {
  ident: 'postcss',
  syntax: require('postcss-scss'),
  plugins: [
    flexbugs(),
    preset({
      autoprefixer: {
        flexbox: 'no-2009',
      },
      stage: 3,
    }),
    normalize(),
    nested(),
    mixins(),
    combinemq(),
    removeDuplicates(),
    cssnano({
      preset: 'default',
    }),
    autoprefixer(),
  ],
};
