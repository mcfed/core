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
import createSagaMiddleware, {SagaMiddleware, Saga} from 'redux-saga';
import {suppressWarnings} from 'core-decorators';

import {
  fetchingMiddleware,
  moduleMiddleware,
  sagaMiddleware
} from '../middleware';
import {orm} from '../model';
import Model, {ORM, Session, OrmState, SessionBoundModel} from 'redux-orm';
import {IndexedModelClasses} from 'redux-orm/ORM';
import {Location} from 'history';
import {ModuleShape} from '../index.d';

const {fetchingReducer} = fetchingMiddleware;
const globalReducer = moduleMiddleware.default;
const createSagaMonitor = sagaMiddleware.default;

/**
 *  let store = new Store({reducers:{},middleares:[]})
 *  store.getStore()
 */

export default class StoreManager<
  I extends IndexedModelClasses<any>,
  ModelNames extends keyof I = keyof I
> {
  // private history : any = null
  private registed: Array<string> = [];
  private asyncReducers: ReducersMapObject<IndexedModelClasses, AnyAction> = [];
  private sagaMiddleware!: SagaMiddleware;

  protected store: Store;

  constructor(
    history: Location,
    reducers: Array<Reducer>,
    middlewares: Array<Middleware>
  ) {
    this.asyncReducers = this.initialReducer(reducers, history);
    this.store = this.createStoreWithMiddleware(middlewares, history)(
      this.makeRootReducer(this.asyncReducers)
    );
  }

  private createStoreWithMiddleware(
    middlewares: Array<Middleware>,
    history: Location
  ) {
    return applyMiddleware.apply(
      this,
      this.initialMiddleware(history, middlewares)
    )(createStore);
  }
  private initialMiddleware(
    history: Location,
    middlweares: Array<Middleware>
  ): Array<Middleware> {
    return [
      (store: any) => {
        this.sagaMiddleware = createSagaMiddleware({
          sagaMonitor: createSagaMonitor({
            //@ts-ignore
            rootReducer: this.asyncReducers,
            storeDispatch: store.dispatch
          })
        });
        return this.sagaMiddleware(store);
      }
    ].concat(middlweares || []);
  }

  private initialReducer(reducers: Array<Reducer>, history: Location) {
    return {
      appReducer: globalReducer,
      fetchingReducer,
      ...reducers
    };
  }
  private makeRootReducer<IndexedModelClasses>(
    asyncReducers: ReducersMapObject<IndexedModelClasses, any>
  ) {
    return combineReducers(asyncReducers);
  }
  private injectSaga(saga: Saga): void {
    this.sagaMiddleware.run(saga);
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
        var session = orm.session({...orm.getEmptyState(), ...state});
        updater(session, action);
        return session.state;
      };
    }
    this.injectReducer('ORMReducer', createReducer(orm));
  }

  public getStore(): Store {
    return this.store;
  }

  public loadModule(loaded: ModuleShape): Object {
    //@ts-ignore
    let moduleName = loaded.model.default.modelName;
    /* istanbul ignore else */
    if (this.registed.indexOf(moduleName) < 0) {
      this.registed = this.registed.concat([moduleName]);
      this.injectReducer(moduleName, loaded.reducer);
      this.store.dispatch({
        type: '@@ModuleMiddleware/register',
        payload: {name: moduleName}
      });
      this.injectModel(orm, loaded.model);
      this.injectSaga(loaded.saga);
    }
    return loaded.default;
  }

  @suppressWarnings
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
}
