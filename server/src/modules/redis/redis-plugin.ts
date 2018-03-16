import { redis } from './redis';

export const redisPlugin = {
  name: 'redis',

  async register(server, options) {
    redis.init();
  }
};
