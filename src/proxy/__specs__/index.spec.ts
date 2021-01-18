import {createStore, applyMiddleware} from 'redux';
import configureStore from 'redux-mock-store';
import {CarSaga, CarReducer, Api} from '../__mock__/mock';

import {
  useActionProxy,
  reduxActionProxy,
  createActionProxy,
  ClassProxy
} from '../index';
import {ActionFactory} from '../../InjectFactory';
describe('reduxActionProxy', () => {
  it('扩充getReducer方法', () => {
    const reducers = reduxActionProxy(new CarReducer());
    const state = {
      a: 1
    };
    expect(reducers).toHaveProperty('getReducer');
    // expect(reducers.getReducer()(state,{meta:""}))
  });
  it('方法调用', () => {
    const reducers = reduxActionProxy(new CarReducer());
    const payload = {a: 3};
    expect(reducers).toHaveProperty('getReducer');
    expect(reducers.inital(payload)).toEqual(payload);
  });

  it('调用 reduxActionProxy 第二个参数', async done => {
    const middleware: never[] = [];
    const initialState = {a: 1, b: 2};
    const mockStore = configureStore(middleware);
    const store = mockStore(initialState);
    const reducers = reduxActionProxy(new CarReducer(), store);
    expect(reducers).toHaveProperty('select');
    //@ts-ignore
    const result = await reducers.select((state: {a: number; b: number}) => {
      return state;
    });
    expect(result).toEqual(initialState);
    done();
  });
});

describe('useActionProxy', () => {
  //  const reducers = reduxActionProxy(new CarReducer());

  it('mock store方法调用 dispatch Action', () => {
    const middleware: never[] = [];
    const mockStore = configureStore(middleware);
    const initialState = {a: 1, b: 2};
    const store = mockStore(initialState);
    const reducerAction = useActionProxy(
      new CarReducer(),
      store.dispatch,
      'CarReducer'
    );
    reducerAction.inital({c: 3});

    expect(store.getActions()[0]).toEqual({
      type: 'CarReducer/inital',
      payload: {c: 3},
      meta: {method: 'inital'}
    });
  });

  it.skip('真实store dispatch 修改 state', () => {
    const reducers = reduxActionProxy(new CarReducer());
    const initialState = {a: 1, b: 2};
    let store = createStore(
      reducers.getReducer(),
      initialState,
      applyMiddleware()
    );
    const reducerAction = useActionProxy(new CarReducer(), store.dispatch);
    reducerAction.inital({c: 1});
    expect(store.getState()).toEqual({...initialState, c: 1});
  });
});

describe('createActionProxy', () => {
  it('调用方法', () => {
    const middleware: never[] = [];
    const mockStore = configureStore(middleware);
    const initialState = {a: 1, b: 2};
    const store = mockStore(initialState);

    const carActions = ActionFactory(CarSaga, store.dispatch, 'CarReducer');
    carActions.run();
    expect(store.getActions()[0]).toEqual({
      type: 'CarReducer/saveItem',
      payload: {},
      meta: {method: 'saveItem'}
    });
    // console.log(store.getActions());
  });
  it('useActionProxy 穿透 select 方法不使用代理对象', () => {
    const middleware: never[] = [];
    const mockStore = configureStore(middleware);
    const initialState = {a: 1, b: 2};
    const store = mockStore(initialState);

    const carActions = ActionFactory(CarSaga, store.dispatch, 'CarReducer');
    // console.log(carActions.reducer.inital({a:1}))
    //@ts-ignore
    // console.log(carActions.reducer.select())
    //@ts-ignore

    reduxActionProxy(carActions.reducer, store)
      .select(function(state: any) {
        return state;
      })
      .then((res: any) => {
        expect(initialState).toBe(res);
      });
  });
});

describe('customProxy', () => {
  class A {
    a() {}
    a1() {}
  }

  class B extends A {
    b() {}
    b1() {}
  }
  class C extends B {
    c() {}
    c1() {}
  }

  it('c use ClassProxy', () => {
    const c = new C();
    //@ts-ignore
    global.Proxy = undefined;
    const classProxy = new ClassProxy(c, {
      get: function(newTarget: any, prop: any) {
        return prop;
      }
    });
    //@ts-ignore
    expect(classProxy.b1).toEqual('b1');
    //@ts-ignore
    expect(classProxy.b).toEqual('b');
    //@ts-ignore
    expect(classProxy.c1).toEqual('c1');
  });
});
