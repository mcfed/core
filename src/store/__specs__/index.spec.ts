import StoreManager from '..';

describe('Name of the group', () => {
  it('create instance', () => {
    const store = new StoreManager();
    expect(store.getStore()).toHaveProperty('dispatch');
    expect(store.getStore()).toHaveProperty('getState');
    expect(store.getStore()).toHaveProperty('subscribe');
    expect(store.getStore()).toHaveProperty('replaceReducer');
  });

  it('create instance with middleware ', () => {
    const store = new StoreManager([], []);
    expect(store.getStore()).toHaveProperty('dispatch');
    expect(store.getStore()).toHaveProperty('getState');
    expect(store.getStore()).toHaveProperty('subscribe');
    expect(store.getStore()).toHaveProperty('replaceReducer');
  });
  xit('create store loadModule(user)', () => {
    const store = new StoreManager();
    const module = require('../__mock__');
    store.loadModule(module);
    expect(store.registed).toEqual(['user']);
    expect(store.getStore().getState()).toHaveProperty('user');
  });

  xit('create store Multiple executions loadModule(user)', () => {
    const store = new StoreManager();
    const module = require('../__mock__');
    store.loadModule(module);
    store.loadModule(module);
    store.loadModule(module);
    expect(store.registed).toEqual(['user']);
    expect(store.getStore().getState()).toHaveProperty('user');
  });

  xit('create store importModule(user)', async () => {
    const store = new StoreManager();
    const module = require('../__mock__');
    const importModule = new Promise((resolve, rejects) => resolve(module));
    expect(await store.importModule(importModule)).toEqual(module.default);
    expect(store.getStore().getState()).toHaveProperty('user');
  });

  xit('create store registerModule(user)', async () => {
    const store = new StoreManager();
    const module = require('../__mock__');
    const importModule = new Promise((resolve, rejects) => resolve(module));
    expect(await store.registerModule(importModule)).toEqual(module.default);
    expect(store.getStore().getState()).toHaveProperty('user');
  });
});
