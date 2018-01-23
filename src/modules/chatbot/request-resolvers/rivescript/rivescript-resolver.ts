import { join } from 'path';
import * as RiveScript from 'rivescript/lib/rivescript';

import { Intent } from './../../intent-resolvers/intent.interface';
import { RequestResolverFunction } from './../request-resolver-function.interface';
import { RequestResolverResult } from '../request-resolver-result.interface';

const rivescriptErrorKeys = [
  'replyNotMatched',
  'replyNotFound',
  'objectNotFound',
  'deepRecursion'
];

const rivescriptErrors = rivescriptErrorKeys.reduce<{[key: string]: string}>((errors, errorKey) => {
  errors[errorKey] = `REPLY ERROR: ${errorKey}`;
  return errors;
}, {});

const rivescript = rivescriptFactory(join(__dirname, 'brain'));

export const rivescriptResolve: RequestResolverFunction = async (request, context) => {
  const rs = await rivescript;
  const reply = await rs.replyAsync(null, request);
  const error = isErrorReply(reply);
  const intent = (error) ? null : {
    type: 'rivescript',
    confidence: 1,
    params: {
      reply
    }
  };
  return {
    intent,
    resolver: 'rivescript',
    resolveData: {
      error,
      reply
    }
  };
}

function isErrorReply(reply: string): string {
  const errorMatches = rivescriptErrorKeys.find((errorKey) => {
    return rivescriptErrors[errorKey] === reply;
  });
  return errorMatches ? errorMatches : null;
}

async function rivescriptFactory(brainPath: string): Promise<RiveScript> {
  const rs = new RiveScript({
    utf8: true,
    concat: 'newline',
    errors: rivescriptErrors
  });
  await new Promise((resolve, reject) => rs.loadDirectory(brainPath, resolve, reject));
  rs.sortReplies();
  return rs;
}
