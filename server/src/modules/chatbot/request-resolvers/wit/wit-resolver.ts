import { Wit, MessageResponse } from 'node-wit';
import * as sortOn from 'sort-on';

import { Intent } from './../../intent-resolvers/intent.interface';
import { RequestResolverFunction } from './../request-resolver-function.interface';
import { RequestResolverResult } from './../request-resolver-result.interface';
import { witClient } from './wit-client';

const minConfidence = .6;

export const witResolve: RequestResolverFunction = async (request, context) => {
  const messageResponse: MessageResponse = await witClient.message(request, context);
  const intent: Intent = getMostConfidentIntent(messageResponse);
  return {
    intent,
    resolver: 'wit',
    resolveData: {
      messageResponse
    }
  }
};

function getMostConfidentIntent(msg: MessageResponse): Intent {
  const entities: {[key: string]: any} = {};
  return Object.keys(msg.entities)
    // filter and sort descending by confidence
    .filter((type) => {
      entities[type] = (msg.entities[type] as any[])
        .filter((entity) => entity.confidence >= minConfidence);
      entities[type] = sortOn(entities[type], '-confidence');
      return entities[type].length > 0;
    })
    // reduce to most confident intent from all entities
    .reduce<Intent>((intent, type) => {
      const entity = entities[type][0];
      if (intent && intent.confidence > entity.confidence) {
        return intent;
      }
      return {
        type,
        confidence: entity.confidence,
        params: {
          ...Object.keys(entity)
            .filter((key) => ['confidence'].indexOf(key) === -1)
            .map<{[key: string]: any}>((key) => entity[key])
        }
      };
    }, null);
}
