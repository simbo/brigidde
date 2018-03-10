import * as Joi from 'joi';
import { couchDocumentSchema } from './../database/couch/couch-document-schema';

export const userDocumentSchema = couchDocumentSchema
  .keys({
    docType: Joi.string().valid('user').required(),
    username: Joi.string().alphanum().min(3).max(32).required(),
    email: Joi.string().email().required(),
    auth: Joi.object().length(1).required().keys({
      github: Joi.object().keys({
        id: Joi.string().min(1).required(),
        token: Joi.string().min(1).required()
      }),
      twitter: Joi.object().keys({
        id: Joi.string().min(1).required(),
        token: Joi.string().min(1).required(),
        secret: Joi.string().min(1).required()
      })
    })
  });
