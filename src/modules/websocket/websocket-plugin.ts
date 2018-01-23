import * as Websocket from 'ws';

import { WebsocketServer } from './websocket-server';

export const websocketPlugin = {

  name: 'websocket',

  async register(server, options) {

    server.decorate('server', 'wss', new WebsocketServer(server));

  }

};
