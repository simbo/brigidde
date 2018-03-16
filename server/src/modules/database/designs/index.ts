import { CouchDesignDocument } from './../couch/couch-design-document.interface';
import usersDesign from './users';

const rawDesigns: { [name: string]: CouchDesignDocument } = {
  users: usersDesign
};

function populateDesign(
  designName: string,
  design: CouchDesignDocument
): CouchDesignDocument {
  design = { ...design };
  delete design._id;
  return {
    _id: `_design/${designName}`,
    ...design
  };
}

export const designs = Object.keys(rawDesigns).map(designName =>
  populateDesign(designName, rawDesigns[designName])
);
