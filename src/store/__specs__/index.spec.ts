import StoreManager from '..';
import {createHashHistory} from 'history';
import {combineReducers} from 'redux';
import {passportMiddleware} from '../../middleware';

describe('Name of the group', () => {
  it('create instance', () => {
    const store = new StoreManager(createHashHistory());
    expect(store.getStore()).toHaveProperty('dispatch');
    expect(store.getStore()).toHaveProperty('getState');
    expect(store.getStore()).toHaveProperty('subscribe');
    expect(store.getStore()).toHaveProperty('replaceReducer');
  });

  it('create instance with middleware ', () => {
    const store = new StoreManager(createHashHistory(), [], []);
    expect(store.getStore()).toHaveProperty('dispatch');
    expect(store.getStore()).toHaveProperty('getState');
    expect(store.getStore()).toHaveProperty('subscribe');
    expect(store.getStore()).toHaveProperty('replaceReducer');
  });
  it('create store loadModule(user22222222222222)', async () => {
    const store = new StoreManager(createHashHistory());
    const module = require('../__mock__');
    const importModule = new Promise((resolve, rejects) => resolve(module));
    const a = await store.importRouterModule(importModule);
    //store.loadModule(module);
    //console.log(22222222,a ,store,store.getStore().getState())
    expect(store.registed).toEqual(['user']);
    //expect(store.getStore().getState()).toHaveProperty([]);
  });

  xit('create store Multiple executions loadModule(user)', () => {
    const store = new StoreManager(createHashHistory());
    const module = require('../__mock__');
    store.loadModule(module);
    store.loadModule(module);
    store.loadModule(module);
    expect(store.registed).toEqual(['user']);
    expect(store.getStore().getState()).toHaveProperty('user');
  });

  xit('create store importModule(user)', async () => {
    const store = new StoreManager(createHashHistory());
    const module = require('../__mock__');
    const importModule = new Promise((resolve, rejects) => resolve(module));
    expect(await store.importModule(importModule)).toEqual(module.default);
    expect(store.getStore().getState()).toHaveProperty('user');
  });

  xit('create store registerModule(user22222)', async () => {
    const store = new StoreManager(createHashHistory());
    const module = require('../__mock__');
    const importModule = new Promise((resolve, rejects) => resolve(module));
    expect(await store.registerModule(importModule)).toEqual(module.default);
    expect(store.getStore().getState()).toHaveProperty('user');
  });

  xit('create instance with middleware22222 ', () => {
    function markRootReducer(asyncReducers: any): any {
      const aa = combineReducers({
        ...asyncReducers,
        // counter,
        aaa,
        abb,
        fetchLogining
      });
      //console.log(21,asyncReducers,aa)
      return aa;
    }
    //@ts-ignore
    const store0 = new StoreManager(
      createHashHistory(),
      //@ts-ignore
      new getReducer(),
      [],
      markRootReducer
    );
    // const a = {
    //    //@ts-ignore
    //   fetchLogining:()=>store0.getStore().dispatch(passportMiddleware.fetchLogining({})),
    //   fetchLogouting:()=>store0.getStore().dispatch(passportMiddleware.fetchLogouting({}))
    // }
    function aaa(state = [], action: any) {
      switch (action) {
        case 'ADD_TODO':
          return 'ss';
        default:
          return state;
      }
    }
    //const middleware={
    function abb(payload: any) {
      //console.log(55,payload)
      return {
        type: 'aaa/bb',
        payload: payload
      };
    }

    function fetchLogining(payload: any) {
      const FETCH_LOGINING = '@@MIDDLEWARE/FETCH_LOGINING';
      return {
        type: FETCH_LOGINING,
        payload: payload
      };
    }

    function getReducer() {}

    function getReducer2(store: any) {
      // const next = store.dispatch
      return function a(next: any) {
        return function b(action: any) {
          let result = action;
          const disp = next.dispatch;
          //  next.dispatch(store.getState().fetchLogining)
          console.log('dispatchingcccccccccccccc', action);
          console.log('dispatchingccccccccccccc22222c', next);
          console.log('dispatchingccccccccccccc222223333333c', disp);
          return store.getState();
        };
      };
    }
    function logger(store: any) {
      const next = store.dispatch;

      // Previously:
      // store.dispatch = function dispatchAndLog(action) {
      return function a() {
        return function dispatchAndLog(action: any) {
          console.log('dispatching', action);
          let result = next(action);
          console.log('next state', store.getState(), next, result);
          // return result
        };
      };
    }
    //@ts-ignore
    const store = new StoreManager(
      createHashHistory(),
      //@ts-ignore
      new getReducer(),
      [],
      markRootReducer
    );
    expect(store.registed).toEqual([]);
    expect(store.getStore()).toHaveProperty('dispatch');
    expect(store.getStore()).toHaveProperty('getState');
    expect(store.getStore()).toHaveProperty('subscribe');
    expect(store.getStore()).toHaveProperty('replaceReducer');
  });
});
