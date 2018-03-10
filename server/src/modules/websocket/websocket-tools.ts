import * as Websocket from 'ws';

import { TokenData } from './../auth/token/token-data.interface';
import { WebsocketMessage } from './websocket-message.interface';

export class WebsocketTools {

  constructor(
    public readonly ws: Websocket,
    public readonly credentials: TokenData
  ) {}

  public send(type: string, payload?: any): void {
    if (this.ws.readyState !== 1) return;
    const message: WebsocketMessage = {type, payload};
    this.ws.send(JSON.stringify(message));
  }

}
