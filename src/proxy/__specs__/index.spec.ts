import {createStore, applyMiddleware} from 'redux';
import configureStore from 'redux-mock-store';
import {CarSaga, CarReducer, Api} from '../__mock__/mock';

import {useActionProxy, reduxActionProxy, createActionProxy} from '../index';
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
});

describe('useActionProxy', () => {
  //  const reducers = reduxActionProxy(new CarReducer());

  it('mock store方法调用 dispatch Action', () => {
    const middleware: never[] = [];
    const mockStore = configureStore(middleware);
    const initialState = {a: 1, b: 2};
    const store = mockStore(initialState);
    const reducerAction = useActionProxy(new CarReducer(), store);
    reducerAction.inital({c: 3});

    expect(store.getActions()[0]).toEqual({
      type: 'CarReducer/inital',
      payload: {c: 3},
      meta: {method: 'inital'}
    });
  });

  it('真实store dispatch 修改 state', () => {
    const reducers = reduxActionProxy(new CarReducer());
    const initialState = {a: 1, b: 2};
    let store = createStore(
      reducers.getReducer(),
      initialState,
      applyMiddleware()
    );
    const reducerAction = useActionProxy(new CarReducer(), store);
    reducerAction.inital({c: 1});
    expect(store.getState()).toEqual({...initialState, c: 1});
  });
});

describe('createActionProxy', () => {
  xit('调用方法', () => {
    const middleware: never[] = [];
    const mockStore = configureStore(middleware);
    const initialState = {a: 1, b: 2};
    const store = mockStore(initialState);

    const Actions = createActionProxy(CarSaga, store);
    const carActions = new Actions(CarReducer, new Api());
    carActions.run();
    expect(store.getActions()[0]).toEqual({
      type: 'CarReducer/saveItem',
      payload: {},
      meta: {method: 'saveItem'}
    });
    console.log(store.getActions());
  });
});
