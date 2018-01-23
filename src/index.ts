import { join, dirname } from 'path';
import { config } from 'dotenv';

config({
  path: join(dirname(__dirname), '.env'),
  encoding: 'utf8'
});

import { startServer } from './modules/server/server';

startServer()
  .then((server) => {
    console.log(`🦄  App listening on ${server.info.host}:${server.info.port}…`);
  })
  .catch((err) => {
    console.log(err);
  });
