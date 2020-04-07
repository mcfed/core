import {createSelector, SessionBoundModel} from 'redux-orm';
import {orm} from '../model';
import {IndexedModelClasses} from 'redux-orm/ORM';

export const ormSelector = (state: any) => state.ORMReducer;

let defaultFilterCallback = () => true;
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
  return createSelector(orm, (session: any) => {
    return session[modelName].idExists(key)
      ? session[modelName].withId(key)
      : session[modelName].parse({});
  })(ormSelector(state));
}

/**
 *   getList all
 *
 *
 **/

export function reducerListSelector(
  state: any,
  modelName: string,
  filterCB: Function = defaultFilterCallback
): Array<SessionBoundModel> {
  return createSelector(
    orm,
    //@ts-ignore
    (session: Session<IndexedModelClasses>) => {
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
  )(ormSelector(state));
}

/**
 *   getModel
 *
 *
 **/

export function reducerModel(
  state: any,
  modelName: string
): Array<SessionBoundModel> {
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
  props?: Object,
  filterCB: Function = defaultFilterCallback
): Array<SessionBoundModel> {
  return createSelector(
    orm,
    //@ts-ignore
    (session: Session<IndexedModelClasses>) => {
      return session[modelName].all().toModelArray();
    }
  )(ormSelector(state));
}
