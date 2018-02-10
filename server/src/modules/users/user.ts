import * as uuid from 'uuid/v4';

import { UserDocument } from "./user-document.interface";
import { userDocumentSchema } from './user-document-schema';

export class User {

  public readonly doc: UserDocument

  constructor(doc: UserDocument) {
    if (!doc._id) doc._id = uuid();
    if (!doc.docType) doc.docType = 'user';
    const docValidation = userDocumentSchema.validate(doc);
    if (docValidation.error) throw docValidation.error;
    this.doc = doc;
  }

  public get id(): string {
    return this.doc._id;
  }

  public get username(): string {
    return this.doc.username;
  }

  public get email(): string {
    return this.doc.email;
  }

  public get auth(): {type: string; options: any;} {
    const type = Object.keys(this.doc.auth)[0];
    const options = this.doc.auth[type];
    return { type, options };
  }

}
