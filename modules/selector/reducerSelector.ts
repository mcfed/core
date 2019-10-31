import {createSelector, SessionBoundModel} from 'redux-orm';
import {orm} from '../model';
import {IndexedModelClasses} from 'redux-orm/ORM';


export const ormSelector = (state: any) => state.ORMReducer;

/**
 *   getItem by key
 *
 *
 **/


export function reducerItemSelector(
  state: any,
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
  )(ormSelector(state));
}

/**
 *   getList all
 *
 *
 **/

export function reducerListSelector(state:any, modelName: string) {
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
  )(ormSelector(state));
}

/**
 *   getModel
 *
 *
 **/

export function reducerModel(state:any, modelName: string) {
  return createSelector(
    orm,
    //@ts-ignore
    (session: Session<IndexedModelClasses>) => {
      return session[modelName];
    }
  )(ormSelector(state));
}

/**
 *   getListPage
 *
 *
 **/

export function reducerPageSelector(
  state: any,
  modelName: string,
  props: Object
) {
  return createSelector(
    orm,
    //@ts-ignore
    (session: Session<IndexedModelClasses>) => {
      return session[modelName].all().toModelArray();
    }
  )(ormSelector(state));
}

export function reducerListSelectorFilter(
  state: any,
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
  )(ormSelector(state));
}

