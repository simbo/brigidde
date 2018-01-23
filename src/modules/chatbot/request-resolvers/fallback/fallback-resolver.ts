import { RequestResolverFunction } from './../request-resolver-function.interface';
import { RequestResolverResult } from '../request-resolver-result.interface';

export const fallbackResolve: RequestResolverFunction = async (): Promise<RequestResolverResult> => {
  return {
    intent: {
      type: 'unknown',
      confidence: 1
    },
    resolver: 'fallback',
    resolveData: null
  };
};
