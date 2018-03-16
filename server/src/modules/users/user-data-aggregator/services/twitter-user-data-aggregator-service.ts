import * as TwitterApi from 'twitter';

import { UserDocument } from './../../user-document.interface';
import { UserDataAggregatorService } from './../user-data-aggregator-service.interface';

export class TwitterUserDataAggregatorService implements UserDataAggregatorService {
  private readonly api: TwitterApi;

  constructor(private readonly token: string, private readonly secret: string) {
    this.api = new TwitterApi({
      consumer_key: process.env.APP_TWITTER_CLIENT_ID,
      consumer_secret: process.env.APP_TWITTER_CLIENT_SECRET,
      access_token_key: token,
      access_token_secret: secret
    });
  }

  public async getUserDocument(): Promise<UserDocument> {
    const { id_str, screen_name, email } = await new Promise<any>((resolve, reject) => {
      this.api.get(
        'account/verify_credentials',
        {
          include_entities: false,
          skip_status: true,
          include_email: true
        },
        (err, data, response) => {
          if (err) return reject(new Error(err.message));
          resolve(data);
        }
      );
    });
    return {
      username: screen_name,
      email,
      auth: {
        twitter: {
          id: id_str,
          token: this.token,
          secret: this.secret
        }
      }
    };
  }
}
