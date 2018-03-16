import * as Boom from 'boom';

import { generateToken } from './token/token-helpers';
import { User } from './../users/user';
import { usersRepository } from './../users/users-repository';
import { UserDataAggregator } from './../users/user-data-aggregator/user-data-aggregator';

export const authRoutes = [
  {
    method: 'GET',
    path: '/auth/github',
    options: {
      auth: 'github'
    },
    async handler(req, h) {
      if (!req.auth.isAuthenticated) {
        return Boom.unauthorized();
      }
      const githubId = req.auth.credentials.profile.id.toString();
      const githubToken = req.auth.credentials.token;
      const existingUser = await usersRepository.oneByGithubId(githubId);
      if (existingUser) {
        return h.response(existingUser.doc);
      }
      const aggregator = new UserDataAggregator('github', githubToken);
      const newUser = await aggregator.getUser();
      if (await usersRepository.isUsernameTaken(newUser.username)) {
        return Boom.badRequest('username already taken');
      }
      const user = await usersRepository.insert(newUser);
      return h.response(user.doc);
    }
  },

  {
    method: 'GET',
    path: '/auth/twitter',
    options: {
      auth: 'twitter'
    },
    async handler(req, h) {
      if (req.auth.isAuthenticated) {
        const twitterId = req.auth.credentials.profile.id;
        const twitterToken = req.auth.credentials.token;
        const twitterSecret = req.auth.credentials.secret;
        const existingUser = await usersRepository.oneByTwitterId(twitterId);
        if (existingUser) {
          return h.response(existingUser.doc);
        }
        const aggregator = new UserDataAggregator('twitter', twitterToken, twitterSecret);
        const newUser = await aggregator.getUser();
        if (await usersRepository.isUsernameTaken(newUser.username)) {
          return Boom.badRequest('username already taken');
        }
        const user = await usersRepository.insert(newUser);
        return h.response(user.doc);
      }
      return Boom.unauthorized();
    }
  },

  {
    method: 'GET',
    path: '/auth/token',
    options: {
      auth: 'jwt-ignore-expiration'
    },
    async handler(req, h) {
      const userId = req.auth.credentials.userId;
      const token = await generateToken(userId);
      return h.response({}).header('Authorization', `Bearer ${token}`);
    }
  }
];
