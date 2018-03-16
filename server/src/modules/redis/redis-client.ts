import * as Redis from 'redis';

const redisOptions = {
  host: process.env.APP_REDIS_HOSTNAME,
  port: parseInt(process.env.APP_REDIS_PORT, 10) || 6379,
  password: process.env.APP_REDIS_PASSWORD
};

const retryMaxTime = 1000 * 60 * 60;
const retryMaxAttempts = 10;
const retryMaxDelay = 3000;

export class RedisClient {
  private client: Redis.RedisClient;

  constructor() {}

  public async init(): Promise<void> {
    if (this.client) return;
    const options = {
      ...redisOptions,
      retryStrategy: this.getRetryStrategy()
    };
    this.client = Redis.createClient(redisOptions);
  }

  private getRetryStrategy(): (options: any) => number | Error {
    return options => {
      if (options.error && options.error.code === 'ECONNREFUSED') {
        return new Error('redis server refused the connection');
      }
      if (options.total_retry_time > retryMaxTime) {
        return new Error('redis connection retry time exhausted');
      }
      if (options.attempt > retryMaxAttempts) {
        return undefined;
      }
      return Math.min(options.attempt * 100, retryMaxDelay);
    };
  }
}
