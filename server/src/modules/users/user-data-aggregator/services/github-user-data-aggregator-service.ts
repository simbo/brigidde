import * as GithubApi from '@octokit/rest';

import { UserDocument } from './../../user-document.interface';
import { UserDataAggregatorService } from './../user-data-aggregator-service.interface';

export class GithubUserDataAggregatorService implements UserDataAggregatorService {

  private readonly api: GithubApi;

  constructor(
    private readonly token: string
  ) {
    this.api = new GithubApi();
    this.api.authenticate({
      type: 'oauth',
      token: this.token
    });
  }

  public async getUserDocument(): Promise<UserDocument> {
    const { id, login } = (await this.api.users.get({})).data;
    const email = (await this.api.users.getEmails({})).data
      .filter((value) => value.primary && value.verified)
      .map((value) => value.email)[0];
    return {
      username: login,
      email,
      auth: {
        github: {
          id: id.toString(),
          token: this.token
        }
      }
    };
  }


}
