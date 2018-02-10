import { logger } from './../../log/logger';
import { URL } from 'url';
import * as nano from 'nano';
import * as uuid from 'uuid/v4';

import { CouchDocument } from './couch-document.interface';
import { CouchDesignDocument } from './couch-design-document.interface';

const couchdbUrl = new URL(`http://${process.env.APP_COUCHDB_HOSTNAME}`);
couchdbUrl.port = process.env.APP_COUCHDB_PORT || '5984';
if (process.env.APP_COUCHDB_USER) {
  couchdbUrl.username = process.env.APP_COUCHDB_USER;
  couchdbUrl.password = process.env.APP_COUCHDB_PASSWORD;
}

export class CouchDb {

  private readonly server: nano.ServerScope;
  private db: nano.DocumentScope<CouchDocument>;

  constructor(
    private readonly dbName: string,
    private readonly designs: CouchDesignDocument[]
  ) {
    this.server = nano(couchdbUrl.toString()) as nano.ServerScope;
  }

  public async init(): Promise<void> {
    if (this.db) return;
    await this.createDb();
    this.db = this.server.use(this.dbName);
    await this.updateDesigns();
  }

  public async insert(
    doc: CouchDocument,
    getLatestRevId: boolean = false
  ): Promise<CouchDocument> {
    if (!doc._id) doc._id = uuid();
    const revId = getLatestRevId ? await this.getLatestRevId(doc._id) : null;
    if (revId) doc._rev = revId;
    return new Promise<CouchDocument>((resolve, reject) => {
      this.db.insert(doc, (err, body) => {
        if (err) return reject(err);
        doc._rev = body.rev;
        resolve(doc);
      });
    });
  }

  public async get(docId: string): Promise<CouchDocument> {
    return new Promise<CouchDocument>((resolve, reject) => {
      this.db.get(docId, (err, body) => {
        if (err) {
          if (err.statusCode === 404) return resolve(null);
          return reject(err);
        }
        resolve(body);
      });
    });
  }

  public async view(
    designName: string,
    viewName: string,
    params: nano.DocumentViewParams = {}
  ): Promise<CouchDocument[]> {
    return new Promise<CouchDocument[]>((resolve, reject) => {
      this.db.view(designName, viewName, {
        ...params,
        include_docs: true
      }, (err, body) => {
        if (err) {
          if (err.statusCode === 404) return resolve([]);
          return reject(err);
        }
        const docs = body.rows.map((row) => row['doc'] as CouchDocument);
        resolve(docs);
      });
    });
  }

  public async delete(
    docId: string,
    revId: string = null
  ): Promise<void> {
    if (!revId) revId = await this.getLatestRevId(docId);
    return new Promise<void>((resolve, reject) => {
      this.db.destroy(docId, revId, (err) => {
        if (err) return reject(err);
        resolve();
      });
    });
  }

  public async getLatestRevId(docId: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      this.db.head(docId, (err, body, headers) => {
        if (err) return resolve(null);
        const revId = headers.etag.replace(/(^")|("$)/g, '');
        resolve(revId);
      });
    });
  }

  private async createDb(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.server.db.create(this.dbName, (err, body) => {
        if (err) {
          if (err.statusCode === 412) return resolve();
          reject(err);
        }
        logger.info(`created couchdb database "${this.dbName}"`);
        resolve();
      });
    });
  }

  private async updateDesigns(): Promise<void> {
    await Promise.all(this.designs.map(
      async (design): Promise<void> => {
        let newDesign: CouchDesignDocument;
        const oldDesign: CouchDesignDocument = await this.get(design._id);
        if (!oldDesign) {
          newDesign = design;
        } else {
          const rev = oldDesign._rev;
          delete oldDesign._rev;
          const designString = JSON.stringify(design, (key, val) => {
            if (typeof val === 'function') return val.toString();
            return val;
          });
          const oldDesignString = JSON.stringify(oldDesign);
          if (designString !== oldDesignString) {
            newDesign = design;
            newDesign._rev = rev;
          };
        }
        if (newDesign) {
          await this.insert(newDesign, false);
          logger.info(`inserted couchdb design "${this.dbName}/${newDesign._id}"`);
        }
      }
    ));
  }

}
