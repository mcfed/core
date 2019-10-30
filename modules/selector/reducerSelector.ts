import {createSelector, SessionBoundModel} from 'redux-orm';
import {orm} from '../model';
import {Reducer} from 'redux';
import {OrmSession} from 'redux-orm/Session';
import {IndexedModelClasses} from 'redux-orm/ORM';

/**
 *   getItem by key
 *
 *
 **/

export function reducerItemSelector(
  reducer: Reducer,
  modelName: string,
  key: string
) {
  return createSelector(
    orm,
    (session: any) => {
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

export function reducerListSelector(reducer: Reducer, modelName: string) {
  return createSelector(
    orm,
    //@ts-ignore
    (session: Session<IndexedModelClasses>) => {
      return session[modelName]
        .all()
        .filter(
          (model: SessionBoundModel) =>
            !(JSON.stringify(model) === '{}' || model.id === '')
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

export function reducerModel(reducer: Reducer, modelName: string) {
  return createSelector(
    orm,
    //@ts-ignore
    (session: Session<IndexedModelClasses>) => {
      return session[modelName];
    }
  )(reducer);
}

/**
 *   getListPage
 *
 *
 **/

export function reducerPageSelector(
  reducer: Reducer,
  modelName: string,
  props: Object
) {
  return createSelector(
    orm,
    //@ts-ignore
    (session: Session<IndexedModelClasses>) => {
      return session[modelName].all().toModelArray();
    }
  )(reducer);
}

export function reducerListSelectorFilter(
  reducer: Reducer,
  modelName: string,
  filterCallback: Function
) {
  return createSelector(
    orm,
    //@ts-ignore
    (session: Session<IndexedModelClasses>) => {
      return session[modelName]
        .all()
        .filter(filterCallback)
        .toModelArray();
    }
  )(reducer);
}
