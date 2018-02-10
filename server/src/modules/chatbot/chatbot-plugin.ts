import * as uuid from 'uuid/v4';

import { randomInt } from '../shared/random-int';
import { WebsocketMessage } from './../websocket/websocket-message.interface';
import { chatbotRoutes } from './chatbot-routes';
import { chatbot } from './chatbot';

export const chatbotPlugin = {

  name: 'chatbot',

  async register(server, options) {

    server.route(chatbotRoutes);

    server.wss.on('/', 'message', (content, ws) => {
      const jobId = uuid();
      const responseMinDuration = randomInt(200, 600);
      const responseStart = Date.now();
      const respond = (cb: () => void): void => {
        const responseDuration = Date.now() - responseStart;
        const responseDelay = responseMinDuration - responseDuration;
        if (responseDelay <= 0) return cb();
        setTimeout(() => cb(), responseDelay);
      };
      ws.send('job:started', jobId);
      chatbot.message(content)
        .then((response) => respond(() => {
          ws.send('job:finished', jobId);
          ws.send('message', response);
        }))
        .catch((error) => respond(() => {
          ws.send('job:finished', jobId);
          ws.send('error', `ERROR: ${error.message || error}`);
        }));
    });

  }

};
