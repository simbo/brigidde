import { RequestResolverFunction } from './request-resolver-function.interface';
import { rivescriptResolve } from './rivescript/rivescript-resolver';
import { witResolve } from './wit/wit-resolver';
import { fallbackResolve } from './fallback/fallback-resolver';

export const requestResolvers: RequestResolverFunction[] = [
  rivescriptResolve,
  // witResolve,
  fallbackResolve
];
