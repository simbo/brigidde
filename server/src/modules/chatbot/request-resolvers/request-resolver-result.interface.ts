import { Intent } from './../intent-resolvers/intent.interface';

export interface RequestResolverResult {
  intent: Intent;
  resolver: string;
  resolveData: { [key: string]: any };
}
