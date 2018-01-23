import { authScheme } from "./auth-scheme";

export const authPlugin = {

  name: 'auth',

  async register(server, options) {
    server.auth.scheme('jwt', authScheme);
    server.auth.strategy('jwt', 'jwt');
    server.auth.default('jwt');
  }

};
