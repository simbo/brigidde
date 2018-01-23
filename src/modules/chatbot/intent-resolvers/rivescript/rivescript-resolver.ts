import { Intent } from './../intent.interface';
import { IntentResolverFunction } from './../intent-resolver-function.interface';

export const rivescriptResolve: IntentResolverFunction = async (intent: Intent) => {
  return intent.params.reply;
};
