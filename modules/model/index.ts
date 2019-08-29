import {ORM, createSelector} from 'redux-orm';
//@ts-ignore
import BaseModel from './BaseModel.ts';
//@ts-ignore
import Attr, {attr} from './Attr.ts';
//@ts-ignore
import {
  reducerListPageSelector,
  reducerItemSelector
} from './reducerSelector.ts';

//@ts-ignore
class ModelORM extends ORM {
  constructor(props: any) {
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
  BaseModel,
  Attr,
  attr,
  reducerListPageSelector,
  reducerItemSelector
};
