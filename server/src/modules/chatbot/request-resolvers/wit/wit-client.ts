import { Wit } from 'node-wit';

export const witClient = new Wit({
  accessToken: process.env.APP_WIT_TOKEN
});
