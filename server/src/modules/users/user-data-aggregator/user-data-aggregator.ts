import { UserDocument } from './../user-document.interface';
import { User } from './../user';
import { UserDataAggregatorService } from './user-data-aggregator-service.interface';
import { GithubUserDataAggregatorService } from './services/github-user-data-aggregator-service';
import { TwitterUserDataAggregatorService } from './services/twitter-user-data-aggregator-service';

export class UserDataAggregator {

  public static services = {
    github: GithubUserDataAggregatorService,
    twitter: TwitterUserDataAggregatorService
  };

  private readonly service: UserDataAggregatorService;

  constructor(
    service: string,
    ...args: any[]
  ) {
    if (!UserDataAggregator.services.hasOwnProperty(service)) {
      throw new Error(`unknown user data aggregator service: '${service}'`);
    }
    this.service = new (UserDataAggregator.services[service] as any)(...args);;
  }

  public async getUser(): Promise<User> {
    const doc = await this.service.getUserDocument();
    return new User(doc);
  }

}
