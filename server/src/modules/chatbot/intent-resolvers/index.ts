import { IntentResolverFunction } from './intent-resolver-function.interface';
import { rivescriptResolve } from './rivescript/rivescript-resolver';
import { unknownResolve } from './unknown/unknown-resolver';

export const intentResolvers: {[name: string]: IntentResolverFunction} = {
  rivescript: rivescriptResolve,
  unknown: unknownResolve
};
