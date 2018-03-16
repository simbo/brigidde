import { database } from './database';

export const databasePlugin = {
  name: 'database',

  async register(server, options) {
    await database.init();
  }
};
