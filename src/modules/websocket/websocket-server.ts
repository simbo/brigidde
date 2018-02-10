import * as Path from 'path';
import * as HTTP from 'http';
import * as URL from 'url';
import * as Hapi from 'hapi';
import * as Websocket from 'ws';

import { verifyToken, decodeToken } from './../auth/token/token-helpers';
import { TokenData } from './../auth/token/token-data.interface';
import { WebsocketMessage } from './websocket-message.interface';
import { WebsocketMessageHandler } from './websocket-message-handler.interface';
import { WebsocketTools } from './websocket-tools';

export class WebsocketServer {

  public readonly wss: Websocket.Server;
  private messageHandlers: {[path: string]: {[type: string]: WebsocketMessageHandler}} = {};

  constructor(server: Hapi.Server) {
    this.wss = new Websocket.Server({
      server: server.listener,
      verifyClient: (info, cb) => this.verifyClient(info, cb)
    });
    this.wss.on('connection', (ws, req) => {
      ws.on('message', (data: Websocket.Data) => this.onMessage(ws, req, data));
    });
  }

  public on(path: string, type: string, handler: WebsocketMessageHandler): void {
    path = Path.join('/', path || '');
    if (!this.messageHandlers.hasOwnProperty(path)) {
      this.messageHandlers[path] = {};
    }
    this.messageHandlers[path][type] = handler;
  }

  public off(path: string, type: string): void {
    path = Path.join('/', path || '');
    if (!this.messageHandlers.hasOwnProperty(path)) return;
    if (!this.messageHandlers[path].hasOwnProperty(type)) return;
    delete this.messageHandlers[path][type];
  }

  private onMessage(ws: Websocket, req: HTTP.IncomingMessage, data: Websocket.Data): void {
    const path = URL.parse(req.url).pathname;
    if (!this.messageHandlers.hasOwnProperty(path)) return;
    const message: WebsocketMessage = JSON.parse(data.toString());
    if (!message.type || !this.messageHandlers[path].hasOwnProperty(message.type)) return;
    const token = this.extractTokenFromRequest(req);
    const credentials = decodeToken(token);
    const tools = new WebsocketTools(ws, credentials);
    this.messageHandlers[path][message.type](message.payload, tools);
  }

  private verifyClient(info, callback): void {
    const token = this.extractTokenFromRequest(info.req);
    verifyToken(token)
      .then(() => callback(true))
      .catch(() => callback(false, 401, 'websocket client authentication failed'))
  }

  private extractTokenFromRequest(req: HTTP.IncomingMessage): string {
    return URL.parse(req.url, true).query.token as string;
  }

}
