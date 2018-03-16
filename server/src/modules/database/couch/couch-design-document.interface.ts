import { CouchDocument } from './couch-document.interface';

export interface CouchDesignDocument extends CouchDocument {
  views?: {
    [key: string]: {
      map?: (doc: CouchDocument) => void;
    };
  };
}
