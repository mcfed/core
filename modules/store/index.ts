import {
  createStore,
  applyMiddleware,
  combineReducers,
  StoreCreator,
  Middleware
} from 'redux';
import createSagaMiddleware from 'redux-saga';

//@ts-ignore
import {ModuleMiddleware, ModuleRouter, ModuleModel} from 'mcf-module';

const {connectRouter, routerMiddleware, push} = ModuleRouter;
const {fetchingReducer, globalReducer, createSagaMonitor} = ModuleMiddleware;
const {orm} = ModuleModel;

interface ModuleShape {
  default: Object;
  model?: Object;
  reducer: Function;
  saga: Object;
}

/**
 *  let store = new Store({reducers:{},middleares:[]})
 *  store.getStore()
 */

export default class Store {
  // private history : any = null
  private registerModule: Array<string> = [];
  private asyncReducers: Array<Function> = [];
  private sagaMiddleware = null;

  protected store: StoreCreator;

  constructor(history: any, reducers: any, middlewares: any) {
    this.asyncReducers = this.initialReducer(reducers, history);
    //@ts-ignore
    this.store = this.createStoreWithMiddleware(middlewares, history)(
      this.makeRootReducer(this.asyncReducers)
    );
  }

  private createStoreWithMiddleware(middlewares: any, history: any) {
    return applyMiddleware.apply(this, this.initialMiddleware(middlewares))(
      createStore
    );
  }
  private initialMiddleware(middlweares: any) {
    return [
      (store: any) => {
        //@ts-ignore
        this.sagaMiddleware = createSagaMiddleware({
          sagaMonitor: createSagaMonitor({
            rootReducer: this.asyncReducers,
            storeDispatch: store.dispatch
          })
        });
        //@ts-ignore
        return this.sagaMiddleware(store);
      },
      // createLogger(),
      routerMiddleware(history)
    ].concat(middlweares || []);
  }

  private initialReducer(reducers: any, history: any) {
    return {
      appReducer: globalReducer,
      fetchingReducer,
      router: connectRouter(history),
      ...reducers
    };
  }
  private makeRootReducer(asyncReducers: any) {
    return combineReducers(asyncReducers);
  }
  private injectSaga(saga: any) {
    //@ts-ignore
    // this.sagaMiddleware.run(saga)
  }
  private injectReducer(key: String, reducer: Function) {
    //@ts-ignore
    this.asyncReducers[key] = reducer;
    //@ts-ignore
    this.store.replaceReducer(this.makeRootReducer(this.asyncReducers));
    //@ts-ignore
    this.store.dispatch({type: '@@redux/REPLACE'});
  }

  private injectModel(orm: any, model: any) {
    //@ts-ignore
    Object.values(model)
      .filter((m: any) => typeof m === 'function')
      .map((m: any) => orm.register(m));
    function defaultUpdater(session: any, action: any) {
      session.sessionBoundModels.forEach(function(modelClass: any) {
        /* istanbul ignore else */
        if (typeof modelClass.reducer === 'function') {
          modelClass.reducer(action, modelClass, session);
        }
      });
    }
    function createReducer(orm: any) {
      var updater = defaultUpdater;
      return function(state: any, action: any) {
        var session = orm.session({...orm.getEmptyState(), ...state});
        updater(session, action);
        return session.state;
      };
    }
    this.injectReducer('ORMReducer', createReducer(orm));
  }

  public getStore() {
    return this.store;
  }

  public loadModule(loaded: ModuleShape) {
    //@ts-ignore
    let moduleName = loaded.model.default.modelName;
    /* istanbul ignore else */
    if (this.registerModule.indexOf(moduleName) < 0) {
      this.registerModule = this.registerModule.concat([moduleName]);
      this.injectReducer(moduleName, loaded.reducer);
      //@ts-ignore
      this.store.dispatch({
        type: '@@ModuleMiddleware/register',
        payload: {name: moduleName}
      });
      this.injectModel(orm, loaded.model);
      this.injectSaga(loaded.saga);
    }
    return loaded.default;
  }
  /*
  public registerModule(modulePath:any) {
    return Loadable({
      loader: () => modulePath,
      loading: () => <div className='app-loading'>模块加载中....</div>,
      timeout: 10000,
      render(loaded, props) {
        let Component = loaded.default;
        let moduleName = loaded.model.default.modelName;
        if (store.registerModule.indexOf(moduleName) < 0) {
          injectModel(orm, loaded.model);
          injectSaga(loaded.saga);
          injectReducer(store, {key: moduleName, reducer: loaded.reducer});
          store.dispatch({
            type: '@@ModuleMiddleware/register',
            payload: {name: moduleName}
          });
          store.registerModule = store.registerModule.concat([moduleName]);
        }
        return (
          <ErrorBoundary>
            <Component {...props} />
          </ErrorBoundary>
        );
      }
    });
  }
  */
}
