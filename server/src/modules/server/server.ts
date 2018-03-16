import * as Hapi from 'hapi';
import * as Inert from 'inert';
import * as Vision from 'vision';
import * as Bell from 'bell';

import { databasePlugin } from './../database/database-plugin';
import { redisPlugin } from './../redis/redis-plugin';
import { reporterPlugin } from './../log/reporter-plugin';
import { authPlugin } from './../auth/auth-plugin';
import { websocketPlugin } from './../websocket/websocket-plugin';
import { chatbotPlugin } from './../chatbot/chatbot-plugin';
import { viewManager } from './view-manager';
import { routes } from './routes';
import { onPreResponse } from './server-event-handlers';

export async function startServer(): Promise<Hapi.Server> {
  const server = new Hapi.Server({
    host: process.env.APP_HTTP_HOST,
    port: parseInt(process.env.APP_HTTP_PORT, 10)
  });

  await server.register([
    databasePlugin,
    redisPlugin,
    reporterPlugin,
    Bell,
    Inert,
    Vision,
    authPlugin,
    websocketPlugin,
    chatbotPlugin
  ]);

  server.views(viewManager);

  server.route(routes);

  server.ext('onPreResponse', onPreResponse);

  await server.start();

  return server;
}
