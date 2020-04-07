'use strict';
var __assign =
  (this && this.__assign) ||
  function() {
    __assign =
      Object.assign ||
      function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
          s = arguments[i];
          for (var p in s)
            if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
      };
    return __assign.apply(this, arguments);
  };
Object.defineProperty(exports, '__esModule', {value: true});
var FETCH_PARAMS = '@@MIDDLEWARE/FETCH_PARAMS';
var FETCH_REQ = '@@MIDDLEWARE/FETCH_REQ';
var FETCH_RES = '@@MIDDLEWARE/FETCH_RES';
var FETCH_RESET = '@@MIDDLEWARE/RESET';
function fetchReq(payload) {
  return {
    type: FETCH_REQ,
    payload: payload
  };
}
exports.fetchReq = fetchReq;
function fetchRes(payload) {
  return {
    type: FETCH_RES,
    payload: payload
  };
}
exports.fetchRes = fetchRes;
function fetchParams(payload) {
  return {
    type: FETCH_PARAMS,
    payload: payload
  };
}
exports.fetchParams = fetchParams;
function fetchReset(payload) {
  return {
    type: FETCH_RESET
  };
}
exports.fetchReset = fetchReset;
var initalState = {
  fetching: new Map(),
  params: new Map()
};
function fetchingReducer(state, _a) {
  if (state === void 0) {
    state = initalState;
  }
  var type = _a.type,
    payload = _a.payload;
  var fetching = state.fetching,
    params = state.params;
  switch (type) {
    case FETCH_RESET:
      return {
        fetching: new Map(),
        params: new Map()
      };
    case FETCH_PARAMS:
      return __assign(__assign({}, state), {
        params: params.set(payload.type, payload.payload)
      });
    case FETCH_REQ:
      return __assign(__assign({}, state), {
        fetching: new Map(fetching.set(payload.type, true))
      });
    case FETCH_RES:
      return __assign(__assign({}, state), {
        fetching: new Map(fetching.set(payload.type, false))
      });
    default:
      return state;
  }
  //  return state
}
exports.fetchingReducer = fetchingReducer;
