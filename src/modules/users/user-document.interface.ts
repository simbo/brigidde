import { CouchDocument } from './../database/couch/couch-document.interface';

export interface UserDocument extends CouchDocument {
  docType?: 'user';
  username: string;
  email: string;
  auth: {
    github?: {
      id: string;
      token: string;
    },
    twitter?: {
      id: string;
      token: string;
      secret: string;
    }
  };
}
