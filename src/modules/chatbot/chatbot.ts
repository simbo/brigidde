import { RequestResolverResult } from './request-resolvers/request-resolver-result.interface';
import { requestResolvers } from './request-resolvers/index';
import { Intent } from './intent-resolvers/intent.interface';
import { intentResolvers } from './intent-resolvers/index';

class Chatbot {

  constructor() {}

  public async message(request: string): Promise<string> {
    const result = await this.resolveRequest(request);
    const response = await this.resolveIntent(result.intent);
    return response;
  }

  private async resolveRequest(request: string): Promise<RequestResolverResult> {
    let result: RequestResolverResult;
    let resolverIndex = 0;
    while (resolverIndex < requestResolvers.length && (!result || !result.intent)) {
      result = await requestResolvers[resolverIndex](request);
      resolverIndex++;
    }
    return result;
  }

  private async resolveIntent(intent: Intent): Promise<string> {
    if (!intent || !intent.type || !intentResolvers.hasOwnProperty(intent.type)) {
      throw new Error(`unresolvable intent: ${intent.type || intent}`);
    }
    return intentResolvers[intent.type](intent);
  }

}

export const chatbot = new Chatbot();
