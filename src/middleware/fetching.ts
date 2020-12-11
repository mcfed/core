import {Action} from 'redux';

const FETCH_PARAMS = '@@MIDDLEWARE/fetchParams';
const FETCH_REQ = '@@MIDDLEWARE/fetchReq';
const FETCH_RES = '@@MIDDLEWARE/fetchRes';
const FETCH_RESET = '@@MIDDLEWARE/fetchReset';

export interface IMWFetch {
  /**
   * 请求状态开始
   * @param payload 请求方法
   */
  fetchReq(payload: Action): void;
  /**
   * 请求状态结束
   * @param payload 请求方法
   */
  fetchRes(payload: Action): void;
  /**
   * 保存请求参数
   * @param payload 请求方法
   */
  fetchParams(payload: Action): void;
  /**
   * 重置请求参数为空
   */
  fetchReset(): void;
}

export function fetchReq(payload: Action) {
  return {
    type: FETCH_REQ,
    payload
  };
}

export function fetchRes(payload: any) {
  return {
    type: FETCH_RES,
    payload
  };
}

export function fetchParams(payload: any) {
  return {
    type: FETCH_PARAMS,
    payload
  };
}
export function fetchReset(payload: any) {
  return {
    type: FETCH_RESET
  };
}

const initalState = {
  fetching: new Map(),
  params: new Map()
};

function fetchingReducer(state = initalState, {type, payload}: any) {
  const {fetching, params} = state;
  switch (type) {
    case FETCH_RESET:
      return {
        fetching: new Map(),
        params: new Map()
      };
    case FETCH_PARAMS:
      return {
        ...state,
        params: params.set(payload.type, payload.payload)
      };
    case FETCH_REQ:
      return {
        ...state,
        fetching: new Map(fetching.set(payload.type, true))
      };
    case FETCH_RES:
      return {
        ...state,
        fetching: new Map(fetching.set(payload.type, false))
      };
    default:
      return state;
  }
  //  return state
}

export {fetchingReducer};
