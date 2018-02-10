import { Intent } from "./intent.interface";

export interface IntentResolverFunction {
  (intent: Intent): Promise<string>;
}
