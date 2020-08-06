import {ORM, ORMOpts} from 'redux-orm';
import {ProxyModel} from './Model';
import {fk, pk, attr, many, oneToOne} from './fields';
import {BaseModel} from './BaseModel';
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
const orm = new ModelORM({
  //@ts-ignore
  stateSelector: (state: any) => state
});
//@ts-ignore

export {orm, ModelORM, ProxyModel, pk, fk, attr, many, oneToOne, BaseModel};
