import { expect } from 'chai';
import { AssertionError } from 'assert';
import * as uuid from 'uuid/v4';
import { clone } from 'hoek';

import { User } from './user';

const fixtures = {
  userDocGithubAuth: {
    username: 'foo',
    email: 'foo@bar.com',
    auth: {
      github: {
        id: 'a',
        token: 'a'
      }
    }
  },
  userDocTwitterAuth: {
    username: 'foo',
    email: 'foo@bar.com',
    auth: {
      twitter: {
        id: 'a',
        token: 'a',
        secret: 'a'
      }
    }
  },
  userDocNoAuth: {
    username: 'foo',
    email: 'foo@bar.com',
    auth: {}
  }
};

describe('User', () => {

  describe('constructor()', () => {

    it('should create a new user with github auth data', () => {
      const doc = clone(fixtures.userDocGithubAuth);
      const user = new User(doc);
      expect(user).to.be.instanceOf(User);
    });

    it('should create a new user with twitter auth data', () => {
      const doc = clone(fixtures.userDocTwitterAuth);
      const user = new User(doc);
      expect(user).to.be.instanceOf(User);
    });

    it('should throw an error without auth data', () => {
      const doc = clone(fixtures.userDocNoAuth);
      const user = () => new User(doc);
      expect(user).to.throw();
    });

  });

  describe('get id()', () => {

    it('should return the generated id for a new user', () => {
      const doc = clone(fixtures.userDocGithubAuth);
      const user = new User(doc);
      expect(user.id).to.be.a('string').with.lengthOf(36);
    });

    it('should return the id from the doc data', () => {
      const doc = clone(fixtures.userDocGithubAuth);
      const id = uuid();
      doc._id = id;
      const user = new User(doc);
      expect(user.id).to.be.equal(id);
    });

  });

  describe('get name()', () => {

    it('should return the username from doc data', () => {
      const doc = clone(fixtures.userDocGithubAuth);
      const user = new User(doc);
      expect(user.username).to.be.equal(fixtures.userDocGithubAuth.username);
    });

  });

  describe('get email()', () => {

    it('should return the email from doc data', () => {
      const doc = clone(fixtures.userDocGithubAuth);
      const user = new User(doc);
      expect(user.email).to.be.equal(fixtures.userDocGithubAuth.email);
    });

  });

  describe('get auth()', () => {

    it('should return auth details object with type and options from doc data for github auth', () => {
      const doc = clone(fixtures.userDocGithubAuth);
      const user = new User(doc);
      expect(user.auth).to.be.deep.equal({
        type: 'github',
        options: fixtures.userDocGithubAuth.auth.github
      });
    });

    it('should return auth details object with type and options from doc data for twitter auth', () => {
      const doc = clone(fixtures.userDocTwitterAuth);
      const user = new User(doc);
      expect(user.auth).to.be.deep.equal({
        type: 'twitter',
        options: fixtures.userDocTwitterAuth.auth.twitter
      });
    });

  });

});
