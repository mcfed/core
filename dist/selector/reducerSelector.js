'use strict';
Object.defineProperty(exports, '__esModule', {value: true});
var redux_orm_1 = require('redux-orm');
var model_1 = require('../model');
exports.ormSelector = function(state) {
  return state.ORMReducer;
};
var defaultFilterCallback = function() {
  return true;
};
/**
 *   getItem by key
 *
 *
 **/
function reducerItemSelector(state, modelName, key) {
  return redux_orm_1.createSelector(model_1.orm, function(session) {
    return session[modelName].idExists(key)
      ? session[modelName].withId(key)
      : session[modelName].parse({});
  })(exports.ormSelector(state));
}
exports.reducerItemSelector = reducerItemSelector;
/**
 *   getList all
 *
 *
 **/
function reducerListSelector(state, modelName, filterCB) {
  if (filterCB === void 0) {
    filterCB = defaultFilterCallback;
  }
  return redux_orm_1.createSelector(
    model_1.orm,
    //@ts-ignore
    function(session) {
      return (
        session[modelName]
          .all()
          // .filter(
          //   (model: SessionBoundModel) =>
          //     !(JSON.stringify(model) === '{}' || model.id === '')
          // )
          .filter(filterCB)
          .toModelArray()
      );
    }
  )(exports.ormSelector(state));
}
exports.reducerListSelector = reducerListSelector;
/**
 *   getModel
 *
 *
 **/
function reducerModel(state, modelName) {
  return redux_orm_1.createSelector(
    model_1.orm,
    //@ts-ignore
    function(session) {
      return session[modelName];
    }
  )(exports.ormSelector(state));
}
exports.reducerModel = reducerModel;
/**
 *   getListPage
 *
 *
 **/
function reducerPageSelector(state, modelName, props, filterCB) {
  if (filterCB === void 0) {
    filterCB = defaultFilterCallback;
  }
  return redux_orm_1.createSelector(
    model_1.orm,
    //@ts-ignore
    function(session) {
      return session[modelName].all().toModelArray();
    }
  )(exports.ormSelector(state));
}
exports.reducerPageSelector = reducerPageSelector;
