import { WebsocketTools } from './websocket-tools';

export interface WebsocketMessageHandler {
  (payload: any, tools: WebsocketTools): Promise<void>;
}
