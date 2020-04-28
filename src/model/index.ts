import {ORM, createSelector, ORMOpts, OrmState} from 'redux-orm';
import {ProxyModel, fk, pk, attr, BaseModel} from './decoator';
export {SessionBoundModel} from 'redux-orm';

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

export {orm, ModelORM, ProxyModel, pk, fk, attr, BaseModel};
