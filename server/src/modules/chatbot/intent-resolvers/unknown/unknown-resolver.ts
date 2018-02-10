import { randomInt } from './../../../shared/random-int';
import { IntentResolverFunction } from './../intent-resolver-function.interface';
import { messages } from './messages';

export const unknownResolve: IntentResolverFunction = async () => {
  const randomIndex = randomInt(0, messages.length - 1);
  return messages[randomIndex];
};
