import {ORM, createSelector, ORMOpts, OrmState} from 'redux-orm';
import BaseModel from './BaseModel';
import Attr, {attr} from './Attr';
import {Model, fieldSetAttr, fieldSetPk, fieldSetFk} from './Model';

//@ts-ignore
class ModelORM extends ORM {
  constructor(props: ORMOpts) {
    super(props);
    //@ts-ignore
    const emptyDBState = this.getEmptyState();
    //@ts-ignore
    this.session(emptyDBState);
  }

  getDatabase() {
    //@ts-ignore
    this.db = this.createDatabase(this.generateSchemaSpec());
    //@ts-ignore
    return this.db;
  }
}
//@ts-ignore
const orm = new ModelORM();

export {
  orm,
  ModelORM,
  BaseModel,
  Attr,
  attr,
  Model,
  fieldSetAttr,
  fieldSetPk,
  fieldSetFk
};
