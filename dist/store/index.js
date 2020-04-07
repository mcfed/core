'use strict';
var __assign =
  (this && this.__assign) ||
  function() {
    __assign =
      Object.assign ||
      function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
          s = arguments[i];
          for (var p in s)
            if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
      };
    return __assign.apply(this, arguments);
  };
var __decorate =
  (this && this.__decorate) ||
  function(decorators, target, key, desc) {
    var c = arguments.length,
      r =
        c < 3
          ? target
          : desc === null
          ? (desc = Object.getOwnPropertyDescriptor(target, key))
          : desc,
      d;
    if (typeof Reflect === 'object' && typeof Reflect.decorate === 'function')
      r = Reflect.decorate(decorators, target, key, desc);
    else
      for (var i = decorators.length - 1; i >= 0; i--)
        if ((d = decorators[i]))
          r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
  };
var __metadata =
  (this && this.__metadata) ||
  function(k, v) {
    if (typeof Reflect === 'object' && typeof Reflect.metadata === 'function')
      return Reflect.metadata(k, v);
  };
var __importDefault =
  (this && this.__importDefault) ||
  function(mod) {
    return mod && mod.__esModule ? mod : {default: mod};
  };
Object.defineProperty(exports, '__esModule', {value: true});
var redux_1 = require('redux');
var redux_saga_1 = __importDefault(require('redux-saga'));
var core_decorators_1 = require('core-decorators');
var middleware_1 = require('../middleware');
var model_1 = require('../model');
var proxy_1 = require('../proxy');
var fetchingReducer = middleware_1.fetchingMiddleware.fetchingReducer;
var globalReducer = middleware_1.moduleMiddleware.globalReducer;
/**
 *  let store = new Store({reducers:{},middleares:[]})
 *  store.getStore()
 */
var StoreManager = /** @class */ (function() {
  function StoreManager(history, reducers, middlewares, makeRootReducer) {
    if (reducers === void 0) {
      reducers = [];
    }
    if (middlewares === void 0) {
      middlewares = [];
    }
    if (makeRootReducer === void 0) {
      makeRootReducer = redux_1.combineReducers;
    }
    // private history : any = null
    this.registed = [];
    this.asyncReducers = [];
    this.makeRootReducer = makeRootReducer;
    this.asyncReducers = this.initialReducer(reducers, history);
    this.store = this.createStoreWithMiddleware(
      middlewares,
      history
    )(this.makeRootReducer(this.asyncReducers));
  }
  StoreManager.prototype.createStoreWithMiddleware = function(
    middlewares,
    history
  ) {
    return redux_1.applyMiddleware.apply(
      this,
      this.initialMiddleware(history, middlewares)
    )(redux_1.createStore);
  };
  StoreManager.prototype.initialMiddleware = function(history, middlweares) {
    this.sagaMiddleware = redux_saga_1.default();
    return [
      this.sagaMiddleware
      //@ts-ignore
    ].concat(middlweares);
  };
  StoreManager.prototype.initialReducer = function(reducers, history) {
    return __assign(
      {appReducer: globalReducer, fetchingReducer: fetchingReducer},
      reducers
    );
  };
  StoreManager.prototype.injectSaga = function(saga) {
    this.sagaMiddleware.run(saga);
  };
  StoreManager.prototype.injectReducer = function(key, reducer) {
    //@ts-ignore
    this.asyncReducers[key] = reducer;
    this.store.replaceReducer(this.makeRootReducer(this.asyncReducers));
    this.store.dispatch({type: '@@redux/REPLACE'});
  };
  StoreManager.prototype.injectModel = function(orm, model) {
    //@ts-ignore
    Object.values(model)
      .filter(function(m) {
        return typeof m === 'function';
      })
      .map(function(m) {
        /* istanbul ignore else */
        //@ts-ignore
        if (orm.registry.indexOf(m) < 0) {
          //@ts-ignore
          orm.register(m);
        }
      });
    function defaultUpdater(session, action) {
      session.sessionBoundModels.forEach(function(modelClass) {
        /* istanbul ignore else */
        if (typeof modelClass.reducer === 'function') {
          modelClass.reducer(action, modelClass, session);
        }
      });
    }
    function createReducer(orm) {
      var updater = defaultUpdater;
      return function(state, action) {
        var session = orm.session(
          __assign(__assign({}, orm.getEmptyState()), state)
        );
        updater(session, action);
        return session.state;
      };
    }
    this.injectReducer('ORMReducer', createReducer(orm));
  };
  StoreManager.prototype.getStore = function() {
    return this.store;
  };
  StoreManager.prototype.loadModule = function(loaded) {
    //@ts-ignore
    var moduleName = loaded.model.default.modelName;
    /* istanbul ignore else */
    if (this.registed.indexOf(moduleName) < 0) {
      this.registed = this.registed.concat([moduleName]);
      this.injectReducer(moduleName, loaded.reducer);
      this.store.dispatch({
        type: '@@ModuleMiddleware/register',
        payload: {name: moduleName}
      });
      this.injectModel(model_1.orm, loaded.model);
      this.injectSaga(loaded.saga);
    }
    return loaded.default;
  };
  StoreManager.prototype.loadClassModule = function(loaded) {
    //@ts-ignore
    var moduleName = loaded.model.default.modelName;
    /* istanbul ignore else */
    if (this.registed.indexOf(moduleName) < 0) {
      this.registed = this.registed.concat([moduleName]);
      var reducer = proxy_1.reduxActionProxy(new loaded.reducer());
      this.injectReducer(moduleName, reducer.getReducer());
      this.store.dispatch({
        type: '@@ModuleMiddleware/register',
        payload: {name: moduleName}
      });
      this.injectModel(model_1.orm, loaded.model);
    }
    return loaded.default;
  };
  StoreManager.prototype.registerModule = function(modulePath) {
    return this.importModule(modulePath);
  };
  StoreManager.prototype.importModule = function(modulePath) {
    var _this = this;
    return new Promise(function(resolve, reject) {
      modulePath.then(function(module) {
        resolve(_this.loadModule(module));
      });
    });
  };
  StoreManager.prototype.importClassModule = function(modulePath) {
    var _this = this;
    return new Promise(function(resolve, reject) {
      modulePath.then(function(module) {
        resolve(_this.loadClassModule(module));
      });
    });
  };
  __decorate(
    [
      core_decorators_1.suppressWarnings,
      __metadata('design:type', Function),
      __metadata('design:paramtypes', [Object]),
      __metadata('design:returntype', Promise)
    ],
    StoreManager.prototype,
    'registerModule',
    null
  );
  return StoreManager;
})();
exports.default = StoreManager;
