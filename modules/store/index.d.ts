import {Middleware, Reducer, ReducersMapObject, Store} from 'redux';
import {Saga} from 'redux-saga';
import Model from 'redux-orm';
import ORM, {IndexedModelClasses} from 'redux-orm/ORM';

export interface ModuleShape {
  default: Object;
  model: Model;
  reducer: Reducer;
  saga: Saga;
}

export default class StoreManager<
  I extends IndexedModelClasses<any>,
  ModelNames extends keyof I = keyof I
> {
  // createStoreWithMiddleware(middlewares: Array<Middleware>, history: Location)

  // initialMiddleware( history: Location, middlweares: Array<Middleware>): Array<Middleware>

  // initialReducer(reducers: Array<Reducer>, history: Location)

  // makeRootReducer<IndexedModelClasses>(asyncReducers: ReducersMapObject<IndexedModelClasses, any>)

  injectSaga(saga: Saga): void;

  injectReducer(key: String, reducer: Reducer): void;

  injectModel(orm: ORM<IndexedModelClasses>, model: Model): void;

  getStore(): Store;

  loadModule(loaded: ModuleShape): Object;

  registerModule(modulePath: any): Promise<ModuleShape>;

  importModule(modulePath: any): Promise<ModuleShape>;
}
