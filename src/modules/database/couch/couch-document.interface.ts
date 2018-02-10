export interface CouchDocument {
  _id?: string;
  _rev?: string;
  [key: string]: any;
}
