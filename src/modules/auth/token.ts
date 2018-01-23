import { sign, verify, decode } from 'jsonwebtoken';
import * as uuid from 'uuid/v4';
import { TokenData } from './token-data.interface';

const jwtSecret = process.env.APP_JWT_SECRET;

export function generateToken(): Promise<string> {
  return new Promise((resolve, reject) => {
    const data: TokenData = {
      id: uuid()
    };
    sign(data, jwtSecret, {}, (err, token) => {
      if (err) reject(err);
      else resolve(token);
    });
  });
}

export function decodeToken(token: string): TokenData {
  return decode(token) as TokenData;
}

export function verifyToken(token: string): Promise<TokenData> {
  return new Promise((resolve, reject) => {
    verify(token, jwtSecret, {}, (err, credentials) => {
      if (err) reject(err);
      else resolve(credentials as TokenData);
    });
  });
}
