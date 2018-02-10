import { DocumentViewParams } from 'nano';

import { CouchDb } from './couch/couch-db';
import { database } from './database';

export abstract class DatabaseRepository<D, O> {

  constructor(
    private readonly ObjectConstructor: new (doc: D) => O
  ) {}

  public async one(id: string): Promise<O> {
    const doc = await database.get(id) as D;
    if (!doc) return null;
    return new this.ObjectConstructor(doc);
  }

  public async insert(obj: O): Promise<O> {
    const doc = await database.insert(obj['doc']) as D;
    return new this.ObjectConstructor(doc);
  }

  protected async oneByDesignViewKey(
    design: string,
    view: string,
    key: any
  ): Promise<O> {
    const doc = await this.oneDocByDesignViewKey(design, view, key);
    if (!doc) return null;
    return new this.ObjectConstructor(doc);
  }

  protected async isDesignViewKeyTaken(
    design: string,
    view: string,
    key: any,
    excludeId: string = null
  ): Promise<boolean> {
    const doc = await this.oneDocByDesignViewKey(design, view, key);
    if (!doc) return false;
    if (excludeId && doc['_id'] === excludeId) return false;
    return true;
  }

  private async oneDocByDesignViewKey(
    design: string,
    view: string,
    key: any
  ): Promise<D> {
    const params = {
      key,
      limit: 1
    };
    return (await database.view(design, view, params))[0] as D;
  }

}
