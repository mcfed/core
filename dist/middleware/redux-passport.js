'use strict';
Object.defineProperty(exports, '__esModule', {value: true});
var FETCH_LOGINING = '@@MIDDLEWARE/FETCH_LOGINING';
var FETCH_LOGOUTING = '@@MIDDLEWARE/FETCH_LOGOUTING';
var FETCH_CONFIG = '@@MIDDLEWARE/FETCH_CONFIG';
function fetchLogining(payload) {
  return {
    type: FETCH_LOGINING,
    payload: payload
  };
}
exports.fetchLogining = fetchLogining;
function fetchLogouting(payload) {
  return {
    type: FETCH_LOGOUTING,
    payload: payload
  };
}
exports.fetchLogouting = fetchLogouting;
function fetchConfig(payload) {
  return {
    type: FETCH_CONFIG,
    payload: payload
  };
}
exports.fetchConfig = fetchConfig;
function createPassport(_a) {
  var loginingProcess = _a.loginingProcess,
    logoutingProcess = _a.logoutingProcess,
    globalProcess = _a.globalProcess;
  return function(_a) {
    var getState = _a.getState,
      dispatch = _a.dispatch;
    return function(next) {
      return function(action) {
        if (FETCH_LOGINING === action.type) {
          loginingProcess && loginingProcess(dispatch, action.payload);
        } else if (FETCH_LOGOUTING === action.type) {
          logoutingProcess && logoutingProcess(dispatch, action.payload);
        } else if (FETCH_CONFIG == action.type) {
          globalProcess && globalProcess(dispatch, action.payload);
        } else {
          return next(action);
        }
        return next(action);
      };
    };
  };
}
exports.default = createPassport;
