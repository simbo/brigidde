const startedAt = Date.now();

import Chalk from 'chalk';

import { join, dirname } from 'path';
import { config } from 'dotenv';

config({
  path: join(dirname(__dirname), '.env'),
  encoding: 'utf8'
});

import { startServer } from './modules/server/server';
import { logger } from './modules/log/logger';

startServer()
  .then((server) => {
    logger.info([
      '✅',
      Chalk.bold('App started'),
      Chalk.dim(`(after ${(Date.now() - startedAt) / 1000} seconds)`),
      `Listening on ${server.info.host}:${server.info.port}…`
    ].join(' '));
  })
  .catch((err) => {
    logger.error(err);
  });
