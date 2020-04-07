'use strict';
Object.defineProperty(exports, '__esModule', {value: true});
var reselect_1 = require('reselect');
var utils_1 = require('./utils');
var reducerSelector_1 = require('./reducerSelector');
exports.reducerModel = reducerSelector_1.reducerModel;
exports.reducerListSelector = reducerSelector_1.reducerListSelector;
exports.reducerItemSelector = reducerSelector_1.reducerItemSelector;
exports.reducerPageSelector = reducerSelector_1.reducerPageSelector;
exports.fetchingStructured = function(state) {
  return state.fetchingReducer;
};
exports.appStructured = function(state) {
  return state.appReducer;
};
exports.spinsSelector = reselect_1.createSelector(
  [exports.fetchingStructured],
  function(selector) {
    return selector.fetching;
  }
);
exports.querysSelector = reselect_1.createSelector(
  [exports.fetchingStructured],
  function(selector) {
    return selector.params;
  }
);
exports.dictsSelector = reselect_1.createSelector(
  [exports.appStructured],
  function(selector) {
    return selector.dicts;
  }
);
exports.reducerSelector = function(state, namespace) {
  return state[namespace];
};
function spins(state, type) {
  return reselect_1.createSelector([exports.spinsSelector], function(spins) {
    return spins.get(type);
  })(state);
}
exports.spins = spins;
function querys(state, type) {
  return reselect_1.createSelector([exports.querysSelector], function(querys) {
    return querys.get(type) || {};
  })(state);
}
exports.querys = querys;
function dicts(state, type, value) {
  var args = arguments;
  return reselect_1.createSelector([exports.dictsSelector], function(dicts) {
    if (args.length > 2) {
      return utils_1.getDictLabel(dicts, type, value);
    } else if (args.length == 2) {
      return utils_1.getDictList(dicts, type);
    } else {
      return dicts;
    }
  })(state);
}
exports.dicts = dicts;
function containerSelector(namespace, props) {
  var id = '';
  //@ts-ignore
  if (props && props.match && props.match.params) {
    //@ts-ignore
    id = props.match.params;
  }
  return reselect_1.createStructuredSelector({
    appReducer: exports.appStructured,
    fetchingReducer: exports.fetchingStructured,
    reducer: function(state) {
      return exports.reducerSelector(state, namespace);
    },
    item: function(state) {
      return reducerSelector_1.reducerItemSelector(state, namespace, id);
    },
    items: function(state) {
      return reducerSelector_1.reducerListSelector(state, namespace);
    }
  });
}
exports.containerSelector = containerSelector;
