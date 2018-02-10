const env = require('./env');

/**
 * Global-scope variables available in all scripts, styles and templates
 */
const globals = {
  ...env
};

module.exports = { globals };
