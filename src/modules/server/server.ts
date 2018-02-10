import * as Hapi from 'hapi';
import * as Vision from 'vision';

import { chatbotPlugin } from './../chatbot/chatbot-plugin';
import { websocketPlugin } from './../websocket/websocket-plugin';
import { authPlugin } from './../auth/auth-plugin';
import { viewManager } from './view-manager';

export async function startServer(): Promise<Hapi.Server> {

  const server = new Hapi.Server({
    host: process.env.APP_HTTP_HOST,
    port: parseInt(process.env.APP_HTTP_PORT, 10)
  });

  await server.register([
    Vision,
    authPlugin,
    websocketPlugin,
    chatbotPlugin
  ]);

  server.views(viewManager);

  await server.start();

  return server;

}
