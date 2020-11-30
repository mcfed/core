import {
  createStore,
  applyMiddleware,
  combineReducers,
  Middleware,
  Reducer,
  ReducersMapObject,
  AnyAction,
  Store
} from 'redux';

import {fetchingMiddleware, moduleMiddleware} from '../middleware';
import {orm} from '../model';
import Model, {ORM, Session, OrmState, SessionBoundModel} from 'redux-orm';
import {IndexedModelClasses} from 'redux-orm/ORM';
// import {Location, LocationState} from 'history';
import {reduxActionProxy} from '../proxy';

const {fetchingReducer} = fetchingMiddleware;
const {globalReducer} = moduleMiddleware;

export interface ModuleShape {
  default: Object;
  model: Model & {
    default: {
      modelName: string;
    };
  };
  reducer: Reducer;
}
/**
 *  let store = new Store({reducers:{},middleares:[]})
 *  store.getStore()
 */

export default class StoreManager<
  I extends IndexedModelClasses<any>,
  ModelNames extends keyof I = keyof I
> {
  // private history : any = null
  public registed: Array<string> = [];
  private asyncReducers: ReducersMapObject<
    IndexedModelClasses<I>,
    AnyAction
  > = [];
  private makeRootReducer: any;
  protected store: Store;

  constructor(
    reducers: Array<Reducer> = [],
    middlewares: Array<Middleware> = [],
    makeRootReducer = combineReducers
  ) {
    this.makeRootReducer = makeRootReducer;
    this.asyncReducers = this.initialReducer(reducers);
    this.store = this.createStoreWithMiddleware(middlewares)(
      this.makeRootReducer(this.asyncReducers)
    );
  }

  private createStoreWithMiddleware(middlewares: Array<Middleware>) {
    return applyMiddleware.apply(this, middlewares)(createStore);
  }

  private initialReducer(reducers: Array<Reducer>) {
    return {
      appReducer: globalReducer,
      fetchingReducer,
      ...reducers
    };
  }
  private injectReducer(key: String, reducer: Reducer): void {
    //@ts-ignore
    this.asyncReducers[key] = reducer;
    this.store.replaceReducer(this.makeRootReducer(this.asyncReducers));
    this.store.dispatch({type: '@@redux/REPLACE'});
  }

  private injectModel(orm: ORM<IndexedModelClasses>, model: Model): void {
    //@ts-ignore
    Object.values(model)
      .filter((m: SessionBoundModel) => typeof m === 'function')
      .map((m: SessionBoundModel) => {
        /* istanbul ignore else */
        //@ts-ignore
        if (orm.registry.indexOf(m) < 0) {
          //@ts-ignore
          orm.register(m);
        }
      });
    function defaultUpdater(
      session: Session<IndexedModelClasses>,
      action: AnyAction
    ) {
      session.sessionBoundModels.forEach(function(modelClass: any) {
        /* istanbul ignore else */
        if (typeof modelClass.reducer === 'function') {
          modelClass.reducer(action, modelClass, session);
        }
      });
    }
    function createReducer(orm: ORM<IndexedModelClasses>) {
      var updater = defaultUpdater;
      return function(state: OrmState<IndexedModelClasses>, action: AnyAction) {
        var session = orm.session({
          ...orm.getEmptyState(),
          ...state
        });
        updater(session, action);
        return session.state;
      };
    }
    this.injectReducer('ORMReducer', createReducer(orm));
  }

  public getStore(): Store {
    return this.store;
  }

  public loadModule(loaded: ModuleShape): any {
    let moduleName = loaded.model.default.modelName;
    /* istanbul ignore else */
    if (this.registed.indexOf(moduleName) < 0) {
      this.registed = this.registed.concat([moduleName]);
      this.injectReducer(moduleName, loaded.reducer);
      this.store.dispatch({
        type: '@@ModuleMiddleware/register',
        payload: {name: moduleName}
      });
      //@ts-ignore
      this.injectModel(orm, loaded.model);
    }
    return loaded.default;
  }

  public loadRouterModule(loaded: any): any {
    let moduleName = loaded.model.default.modelName;
    /* istanbul ignore else */
    if (this.registed.indexOf(moduleName) < 0) {
      this.registed = this.registed.concat([moduleName]);
      const reducer = reduxActionProxy(new loaded.reducer(), this.store);
      this.injectReducer(moduleName, reducer.getReducer());
      this.store.dispatch({
        type: '@@ModuleMiddleware/register',
        payload: {name: moduleName}
      });
      //@ts-ignore
      this.injectModel(orm, loaded.model);
    }
    return loaded.default;
  }

  public registerModule(modulePath: any): Promise<ModuleShape> {
    return this.importModule(modulePath);
  }

  public importModule(modulePath: any): Promise<ModuleShape> {
    return new Promise((resolve: any, reject: any) => {
      modulePath.then((module: ModuleShape) => {
        resolve(this.loadModule(module));
      });
    });
  }

  public importRouterModule(modulePath: any): Promise<any> {
    return new Promise((resolve: any, reject: any) => {
      modulePath.then((module: any) => {
        resolve(this.loadRouterModule(module));
      });
    });
  }
}
