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
var UPGRADE_DICT = '@@MIDDLEWARE/UPGRADE_DICT';
var UPGRADE_BIZCODE = '@@MIDDLEWARE/UPGRADE_BIZCODE';
var UPGRADE_CONFIG = '@@MIDDLEWARE/UPGRADE_CONFIG';
var UPGRADE_USER = '@@MIDDLEWARE/UPGRADE_USER';
var UPGRADE_AUTHS = '@@MIDDLEWARE/UPGRADE_AUTHS';
var CANCEL_TASK = '@@MIDDLEWARE/CANCEL_TASK';
function cancelTask(payload) {
  return {
    type: CANCEL_TASK,
    payload: payload
  };
}
exports.cancelTask = cancelTask;
function upgradeDict(payload) {
  return {
    type: UPGRADE_DICT,
    payload: payload
  };
}
exports.upgradeDict = upgradeDict;
function upgradeBizcode(payload) {
  return {
    type: UPGRADE_BIZCODE,
    payload: payload
  };
}
exports.upgradeBizcode = upgradeBizcode;
function upgradeConfig(payload) {
  return {
    type: UPGRADE_CONFIG,
    payload: payload
  };
}
exports.upgradeConfig = upgradeConfig;
function upgradeUser(payload) {
  return {
    type: UPGRADE_USER,
    payload: payload
  };
}
exports.upgradeUser = upgradeUser;
function upgradeAuths(payload) {
  return {
    type: UPGRADE_AUTHS,
    payload: payload
  };
}
exports.upgradeAuths = upgradeAuths;
function globalReducer(state, _a) {
  if (state === void 0) {
    state = {
      dicts: {},
      bizCodes: {},
      config: {},
      user: {},
      auths: {}
    };
  }
  var type = _a.type,
    payload = _a.payload;
  switch (type) {
    case UPGRADE_DICT:
      return __assign(__assign({}, state), {dicts: payload});
    case UPGRADE_BIZCODE:
      return __assign(__assign({}, state), {bizCodes: payload});
    case UPGRADE_CONFIG:
      return __assign(__assign({}, state), {
        config: Object.assign({}, state.config, payload)
      });
    case UPGRADE_USER:
      return __assign(__assign({}, state), {
        user: Object.assign({}, state.config, payload)
      });
    case UPGRADE_AUTHS:
      return __assign(__assign({}, state), {
        auths: Object.assign({}, state.config, payload)
      });
    default:
      return state;
  }
  //  return state
}
exports.globalReducer = globalReducer;
function globalMiddlware() {
  return function(_a) {
    var getState = _a.getState,
      dispatch = _a.dispatch;
    return function(next) {
      return function(action) {
        next(action);
      };
    };
  };
}
exports.default = globalMiddlware;
