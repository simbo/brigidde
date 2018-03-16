import * as Boom from 'boom';
import { VerifyOptions } from 'jsonwebtoken';

import { verifyToken, tokenFromRequest } from './token-helpers';
import { TokenData } from './token-data.interface';

function tokenAuthSchemeFactory(verifyOptions: VerifyOptions) {
  return (server, options) => {
    return {
      async authenticate(request, h) {
        let credentials: TokenData;
        try {
          const token = tokenFromRequest(request);
          let credentials = await verifyToken(token);
        } catch (err) {
          throw Boom.unauthorized();
        }
        return h.authenticated({ credentials });
      }
    };
  };
}

export const tokenAuthScheme = tokenAuthSchemeFactory({});

export const tokenIgnoreExpirationAuthScheme = tokenAuthSchemeFactory({
  ignoreExpiration: true
});
