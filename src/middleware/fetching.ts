import {Action} from 'redux';

const FETCH_PARAMS = '@@MIDDLEWARE/FETCH_PARAMS';
const FETCH_REQ = '@@MIDDLEWARE/FETCH_REQ';
const FETCH_RES = '@@MIDDLEWARE/FETCH_RES';
const FETCH_RESET = '@@MIDDLEWARE/RESET';

export function fetchReq(payload: any) {
  //Action
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
