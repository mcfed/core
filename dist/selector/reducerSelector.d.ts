import {SessionBoundModel} from 'redux-orm';
export declare const ormSelector: (state: any) => any;
/**
 *   getItem by key
 *
 *
 **/
export declare function reducerItemSelector(
  state: any,
  modelName: string,
  key: string
): any;
/**
 *   getList all
 *
 *
 **/
export declare function reducerListSelector(
  state: any,
  modelName: string,
  filterCB?: Function
): Array<SessionBoundModel>;
/**
 *   getModel
 *
 *
 **/
export declare function reducerModel(
  state: any,
  modelName: string
): Array<SessionBoundModel>;
/**
 *   getListPage
 *
 *
 **/
export declare function reducerPageSelector(
  state: any,
  modelName: string,
  props: Object,
  filterCB?: Function
): Array<SessionBoundModel>;
