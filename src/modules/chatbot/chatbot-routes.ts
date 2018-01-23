import * as Boom from 'boom';
import * as Joi from 'joi';
import { generateToken } from './../auth/token';
import { chatbot } from './chatbot';

export const chatbotRoutes = [

  {
    method: 'GET',
    path: '/token',
    async handler(request, h) {
      return generateToken()
        .then((token) => h.response({token}));
    },
    options: {
      auth: false,
      cors: {
          origin: ['*'],
          additionalHeaders: ['cache-control', 'x-requested-with']
      }
    }
  },

  {
    method: 'POST',
    path: '/message',
    async handler(request, h) {
      return chatbot.message(request.payload.body);
    },
    options: {
      validate: {
        payload: {
          body: Joi.string().min(1).required()
        }
      },
    }
  }

];
