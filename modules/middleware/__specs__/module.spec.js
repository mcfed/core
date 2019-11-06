import * as middleware from '../redux-module.ts';

describe('test action type', () => {
  it('cancelTask', () => {
    const expected = {
      type: '@@MIDDLEWARE/CANCEL_TASK',
      payload: {}
    };
    expect(middleware.cancelTask({}));
  });
  it('upgradeDict', () => {
    const expected = {
      type: '@@MIDDLEWARE/UPGRADE_DICT',
      payload: {}
    };
    expect(middleware.upgradeDict({}));
  });

  it('upgradeBizcode', () => {
    const expected = {
      type: '@@MIDDLEWARE/UPGRADE_BIZCODE ',
      payload: {}
    };
    expect(middleware.upgradeBizcode({}));
  });
  it('upgradeConfig', () => {
    const expected = {
      type: '@@MIDDLEWARE/UPGRADE_CONFIG',
      payload: {}
    };
    expect(middleware.upgradeConfig({}));
  });
  it(' upgradeUser', () => {
    const expected = {
      type: '@@MIDDLEWARE/UPGRADE_USER',
      payload: {}
    };
    expect(middleware.upgradeUser({}));
  });

  it('upgradeAuths', () => {
    const expected = {
      type: '@@MIDDLEWARE/UPGRADE_AUTHS',
      payload: {}
    };
    expect(middleware.upgradeAuths({}));
  });
});
describe('middleware run  type', () => {
  const initialState = {};
  const next = jest.fn();
  const mockStore = {
    getState: jest.fn(() => initialState),
    dispatch: jest.fn(),
    subscribe: jest.fn()
  };

  it('middleware upgradeDict', () => {
    expect(
      middleware.globalReducer(undefined, middleware.upgradeDict({a: 1})).dicts
    ).toEqual({a: 1});
  });

  it('middleware upgradeBizcode', () => {
    expect(
      middleware.globalReducer(undefined, middleware.upgradeBizcode({a: 1}))
        .bizCodes
    ).toEqual({a: 1});
  });

  it('middleware upgradeConfig', () => {
    expect(
      middleware.globalReducer(undefined, middleware.upgradeConfig({a: 1}))
        .config
    ).toEqual({a: 1});
  });

  it('middleware upgradeUser', () => {
    expect(
      middleware.globalReducer(undefined, middleware.upgradeUser({a: 1})).user
    ).toEqual({a: 1});
  });
  it('middleware upgradeAuths', () => {
    expect(
      middleware.globalReducer(undefined, middleware.upgradeAuths({a: 1})).auths
    ).toEqual({a: 1});
  });

  it('middleware undefined', () => {
    expect(middleware.globalReducer(undefined, {type: undefined})).toEqual({
      dicts: {},
      bizCodes: {},
      config: {},
      user: {},
      auths: {}
    });
  });

  it('globalMiddleware', () => {
    const mockNext = jest.fn();
    const mockStore = {
      getState: jest.fn(),
      dispatch: jest.fn()
    };
    middleware.default()(mockStore)(mockNext)({type: 'test'});
    expect(mockNext).toHaveBeenCalled();
  });
});
