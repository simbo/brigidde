import * as Joi from 'joi';
import { chatbot } from './chatbot';

export const chatbotRoutes = [
  {
    method: 'POST',
    path: '/message',
    async handler(request, h) {
      return chatbot.message(request.payload.body);
    },
    options: {
      description: 'responds to given message',
      validate: {
        payload: {
          body: Joi.string()
            .min(1)
            .required()
        }
      }
    }
  }
];
