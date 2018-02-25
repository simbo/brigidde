const { globals } = require('./../globals');

const pugHtmlLoader = {
  loader: 'pug-html-loader',
  options: {
    data: globals
  }
};

module.exports = { pugHtmlLoader };
