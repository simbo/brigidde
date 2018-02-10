import { tokenAuthScheme, tokenIgnoreExpirationAuthScheme } from './token/token-auth-scheme';

export const authPlugin = {

  name: 'auth',

  async register(server, options) {

    server.auth.scheme('jwt', tokenAuthScheme);
    server.auth.strategy('jwt', 'jwt');

    server.auth.scheme('jwt-ignore-expiration', tokenIgnoreExpirationAuthScheme);
    server.auth.strategy('jwt-ignore-expiration', 'jwt-ignore-expiration');

  }

};
