import {createSelector} from 'redux-orm';
//@ts-ignore
import {orm} from './';

/**
 *   getItem by key
 *
 *
 **/

export function reducerItemSelector(
  reducer: any,
  modelName: string,
  key: string
) {
  //@ts-ignore

  return createSelector(
    orm,
    //@ts-ignore
    (session: any, props: any) => {
      return session[modelName].idExists(key)
        ? session[modelName].withId(key)
        : session[modelName].create({});
    }
  )(reducer);
}

/**
 *   getList all
 *
 *
 **/

export function reducerListSelector(reducer: any, modelName: string) {
  //@ts-ignore
  return createSelector(
    orm,
    //@ts-ignore
    (session: any, props: any) => {
      return session[modelName]
        .all()
        .filter(
          (model: any) => !(JSON.stringify(model) === '{}' || model.id === '')
        )
        .toModelArray();
    }
  )(reducer);
}

/**
 *   getModel
 *
 *
 **/

export function reducerModel(reducer: any, modelName: string) {
  //@ts-ignore
  return createSelector(
    orm,
    //@ts-ignore
    (session: any, props: any) => {
      return session[modelName];
    }
  )(reducer);
}

/**
 *   getListPage
 *
 *
 **/

export function reducerListPageSelector(
  reducer: any,
  modelName: any,
  props: any
) {
  return createSelector(
    orm,
    //@ts-ignore
    (session: any, props: any) => {
      return session[modelName].all().toModelArray();
    }
  )(reducer);
}

export function reducerListSelectorFilter(
  reducer: any,
  modelName: any,
  filterCallback: any
) {
  return createSelector(
    orm,
    //@ts-ignore
    (session: any, props: any) => {
      return session[modelName]
        .all()
        .filter(filterCallback)
        .toModelArray();
    }
  )(reducer);
}
