const { postcssLoader } = require('./postcss');
const { stylusLoader } = require('./stylus');
const { pugHtmlLoader } = require('./pug-html');

const loaders = {
  postcss: postcssLoader,
  stylus: stylusLoader,
  pugHtml: pugHtmlLoader
};

module.exports = { loaders };
