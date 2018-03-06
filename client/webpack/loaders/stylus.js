const stylus = require('stylus');

const { globals } = require('./../globals');
const { paths } = require('./../paths');

const stylusLoader = {
  loader: 'stylus-loader',
  options: {
    define: {
      ...globals,
      'inline-url': stylus.url({
        paths: [
          paths.src('images')
        ],
        limit: false
      })
    },
    paths: [
      paths.src('styles', 'imports')
    ]
  }
};

module.exports = { stylusLoader };
