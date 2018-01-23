import * as Boom from 'boom';
import { verifyToken } from './token';

export function authScheme(server, options) {
  return {
    async authenticate(request, h) {
      const auth = request.raw.req.headers.authorization;
      if (!auth || typeof auth !== 'string') {
        throw Boom.unauthorized(null, 'no authorization present');
      }
      const match = auth.match(/^Bearer\s([a-z0-9\._]+)$/i);
      if (!match || match.length !== 2) {
        throw Boom.unauthorized(null, 'invalid authorization string');
      }
      return verifyToken(match[1])
        .then((credentials) => {
          return h.authenticated({credentials});
        })
        .catch(() => {
          throw Boom.unauthorized(null, 'invalid authorization token')
        })
    }
  };
}
