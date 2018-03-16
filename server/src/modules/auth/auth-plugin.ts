import { authRoutes } from './auth-routes';
import {
  tokenAuthScheme,
  tokenIgnoreExpirationAuthScheme
} from './token/token-auth-scheme';

export const authPlugin = {
  name: 'auth',

  async register(server, options) {
    server.dependency(['bell']);

    const defaultOAuthStrategyOptions = {
      password: process.env.APP_COOKIE_SECRET,
      isSecure: process.env.APP_HTTP_SECURE === 'true'
    };

    server.auth.strategy('github', 'bell', {
      ...defaultOAuthStrategyOptions,
      provider: 'github',
      clientId: process.env.APP_GITHUB_CLIENT_ID,
      clientSecret: process.env.APP_GITHUB_CLIENT_SECRET
    });

    server.auth.strategy('twitter', 'bell', {
      ...defaultOAuthStrategyOptions,
      provider: 'twitter',
      clientId: process.env.APP_TWITTER_CLIENT_ID,
      clientSecret: process.env.APP_TWITTER_CLIENT_SECRET
    });

    server.auth.scheme('jwt', tokenAuthScheme);
    server.auth.strategy('jwt', 'jwt');

    server.auth.scheme('jwt-ignore-expiration', tokenIgnoreExpirationAuthScheme);
    server.auth.strategy('jwt-ignore-expiration', 'jwt-ignore-expiration');

    server.route(authRoutes);
  }
};
