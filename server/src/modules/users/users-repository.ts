import { DatabaseRepository } from './../database/database-repository';
import { User } from './user';
import { UserDocument } from './user-document.interface';

class UsersRepository extends DatabaseRepository<UserDocument, User> {
  constructor() {
    super(User);
  }

  public async oneByUsername(username: string): Promise<User> {
    return this.oneByDesignViewKey('users', 'byUsername', username);
  }

  public async isUsernameTaken(
    username: string,
    excludeId: string = null
  ): Promise<boolean> {
    return this.isDesignViewKeyTaken('user', 'byUsername', username, excludeId);
  }

  public async oneByGithubId(githubId: number): Promise<User> {
    return this.oneByDesignViewKey('users', 'byGithubId', githubId);
  }

  public async isGithubIdTaken(
    githubId: number,
    excludeId: string = null
  ): Promise<boolean> {
    return this.isDesignViewKeyTaken('user', 'byGithubId', githubId, excludeId);
  }

  public async oneByTwitterId(twitterId: number): Promise<User> {
    return this.oneByDesignViewKey('users', 'byTwitterId', twitterId);
  }

  public async isTwitterIdTaken(
    twitterId: number,
    excludeId: string = null
  ): Promise<boolean> {
    return this.isDesignViewKeyTaken('user', 'byUsername', twitterId, excludeId);
  }
}

export const usersRepository = new UsersRepository();
