import { RequestResolverResult } from './request-resolver-result.interface';

export interface RequestResolverFunction {
  (request: string, context?: any): Promise<RequestResolverResult>
}
