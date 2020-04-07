import * as middleware from '../redux-passport';

describe('test action type', () => {
  it('fetchLogining', () => {
    const expected = {
      type: '@@MIDDLEWARE/FETCH_LOGINING',
      payload: {}
    };
    expect(middleware.fetchLogining({}));
  });

  it('fetchLogouting', () => {
    const expected = {
      type: '@@MIDDLEWARE/FETCH_LOGOUTING',
      payload: {}
    };
    expect(middleware.fetchLogouting({}));
  });
  it('fetchConfig', () => {
    const expected = {
      type: '@@MIDDLEWARE/FETCH_CONFIG',
      payload: {}
    };
    expect(middleware.fetchConfig({}));
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

  it('globalMiddleware', () => {
    const mockPassport = {
      loginingProcess: jest.fn(),
      logoutingProcess: jest.fn(),
      globalProcess: jest.fn()
    };
    const mockNext = jest.fn();
    const mockStore = {
      getState: jest.fn(),
      dispatch: jest.fn()
    };
    middleware.default(mockPassport)(mockStore)(mockNext)(
      middleware.fetchLogining()
    );
    expect(mockPassport.loginingProcess).toHaveBeenCalled();
    expect(mockNext).toHaveBeenCalled();

    middleware.default(mockPassport)(mockStore)(mockNext)(
      middleware.fetchLogouting()
    );
    expect(mockPassport.logoutingProcess).toHaveBeenCalled();
    expect(mockNext).toHaveBeenCalled();

    middleware.default(mockPassport)(mockStore)(mockNext)(
      middleware.fetchConfig()
    );
    expect(mockPassport.globalProcess).toHaveBeenCalled();
    expect(mockNext).toHaveBeenCalled();
    middleware.default(mockPassport)(mockStore)(mockNext)({type: undefined});
    expect(mockNext).toHaveBeenCalled();
  });
});
