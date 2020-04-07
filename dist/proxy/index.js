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
require('reflect-metadata');
function getProperty(o, name) {
  return o[name]; // o[name] is of type T[K]
}
function useActionProxy(target, store) {
  return new Proxy(target, {
    get: function(newTarget, prop) {
      return function(payload) {
        store.dispatch({
          type: [target.constructor.name, prop].join('/'),
          payload: payload,
          meta: {
            method: prop
          }
        });
      };
    }
  });
}
exports.useActionProxy = useActionProxy;
function reduxActionProxy(target) {
  // const instance = new target();
  return new Proxy(target, {
    get: function(newTarget, prop) {
      if (prop === 'getReducer') {
        return function() {
          //@ts-ignore
          return function(state, action) {
            if (state === void 0) {
              state = target.initalState;
            }
            var _a;
            var prop =
              (_a = action.meta) === null || _a === void 0 ? void 0 : _a.method;
            if (prop !== undefined) {
              return __assign(
                __assign({}, state),
                getProperty(newTarget, prop)(action.payload, state)
              );
            } else {
              return state;
            }
          };
        };
      } else if (newTarget[prop] !== undefined) {
        return function(payload) {
          //@ts-ignore
          return getProperty(newTarget, prop)(payload);
        };
      }
    }
  });
}
exports.reduxActionProxy = reduxActionProxy;
function createActionProxy(target, store) {
  return new Proxy(target, {
    construct: function(target, args) {
      var oneArg = args[0],
        twoArg = args[1];
      return new target(useActionProxy(oneArg, store), twoArg);
    }
  });
}
exports.createActionProxy = createActionProxy;
