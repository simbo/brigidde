import { CouchDb } from './couch/couch-db';
import { designs } from './designs/index';

const dbName = process.env.APP_COUCHDB_DBNAME;

export const database = new CouchDb(dbName, designs);
