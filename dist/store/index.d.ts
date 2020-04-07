import {combineReducers, Middleware, Reducer, Store} from 'redux';
import Model from 'redux-orm';
import {IndexedModelClasses} from 'redux-orm/ORM';
import {LocationState} from 'history';
export interface ModuleShape {
  default: Object;
  model: Model;
  reducer: Reducer;
  saga: any;
}
/**
 *  let store = new Store({reducers:{},middleares:[]})
 *  store.getStore()
 */
export default class StoreManager<
  I extends IndexedModelClasses<any>,
  ModelNames extends keyof I = keyof I
> {
  private registed;
  private asyncReducers;
  private sagaMiddleware;
  private makeRootReducer;
  protected store: Store;
  constructor(
    history: LocationState,
    reducers?: Array<Reducer>,
    middlewares?: Array<Middleware>,
    makeRootReducer?: typeof combineReducers
  );
  private createStoreWithMiddleware;
  private initialMiddleware;
  private initialReducer;
  private injectSaga;
  private injectReducer;
  private injectModel;
  getStore(): Store;
  loadModule(loaded: ModuleShape): Object;
  loadClassModule(loaded: any): Object;
  registerModule(modulePath: any): Promise<ModuleShape>;
  importModule(modulePath: any): Promise<ModuleShape>;
  importClassModule(modulePath: any): Promise<any>;
}
