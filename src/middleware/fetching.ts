import {Action} from 'redux';

const FETCH_PARAMS = '@@MIDDLEWARE/fetchParams';
const FETCH_REQ = '@@MIDDLEWARE/fetchReq';
const FETCH_RES = '@@MIDDLEWARE/fetchRes';
const FETCH_RESET = '@@MIDDLEWARE/fetchReset';

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
