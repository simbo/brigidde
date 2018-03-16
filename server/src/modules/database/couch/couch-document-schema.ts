import * as Joi from 'joi';

export const couchDocumentSchema = Joi.object().keys({
  _id: Joi.string()
    .guid({ version: ['uuidv4'] })
    .required(),
  _rev: Joi.string()
});
