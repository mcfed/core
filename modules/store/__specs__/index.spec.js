import Store from '../index.ts';
import {createHashHistory} from 'history';
import * as UserModel from '../__module__';

describe('Name of the group', () => {
  it('create instance', () => {
    // Store.initialReducer()
    const store = new Store(createHashHistory());
    expect(store.getStore()).toHaveProperty('dispatch');
    expect(store.getStore()).toHaveProperty('getState');
    expect(store.getStore()).toHaveProperty('subscribe');
    expect(store.getStore()).toHaveProperty('replaceReducer');
  });
  it('create store loadModule(user)', () => {
    const store = new Store(createHashHistory());
    store.loadModule(UserModel);
    expect(store.registerModule).toEqual(['user']);
    store.loadModule(UserModel);
    expect(store.getStore().getState()).toHaveProperty('user');
  });
});
