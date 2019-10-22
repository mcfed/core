import * as FetchingMiddleware from '../fetching.ts';

describe('test action type', () => {
  it('fetchReq', () => {
    const expected = {
      type: '@@MIDDLEWARE/FETCH_REQ',
      payload: {}
    };
    expect(FetchingMiddleware.fetchReq({}));
  });

  it('fetchRes', () => {
    const expected = {
      type: '@@MIDDLEWARE/FETCH_RES',
      payload: {}
    };
    expect(FetchingMiddleware.fetchRes({}));
  });
  it('fetchParams', () => {
    const expected = {
      type: '@@MIDDLEWARE/FETCH_PARAMS',
      payload: {}
    };
    expect(FetchingMiddleware.fetchParams({}));
  });
  it('fetchReset', () => {
    const expected = {
      type: '@@MIDDLEWARE/RESET',
      payload: {}
    };
    expect(FetchingMiddleware.fetchReset({}));
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

  it('middleware fetchReq', () => {
    expect(
      FetchingMiddleware.fetchingReducer(
        undefined,
        FetchingMiddleware.fetchReq({type: 'test'})
      ).fetching.get('test')
    ).toBe(true);
  });

  it('middleware fetchRes', () => {
    expect(
      FetchingMiddleware.fetchingReducer(
        undefined,
        FetchingMiddleware.fetchRes({type: 'test'})
      ).fetching.get('test')
    ).toBe(false);
  });
  it('middleware params', () => {
    expect(
      FetchingMiddleware.fetchingReducer(
        undefined,
        FetchingMiddleware.fetchParams({type: 'test', payload: {a: 1}})
      ).params.get('test')
    ).toEqual({a: 1});
  });
  it('middleware reset', () => {
    expect(
      FetchingMiddleware.fetchingReducer(
        undefined,
        FetchingMiddleware.fetchReset()
      ).params
    ).toEqual(new Map());
  });
});
