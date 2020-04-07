import {
  reducerModel,
  reducerListSelector,
  reducerItemSelector,
  reducerPageSelector
} from './reducerSelector';
export declare const fetchingStructured: (state: any) => any;
export declare const appStructured: (state: any) => any;
export declare const spinsSelector: import('reselect').OutputSelector<
  any,
  any,
  (res: any) => any
>;
export declare const querysSelector: import('reselect').OutputSelector<
  any,
  any,
  (res: any) => any
>;
export declare const dictsSelector: import('reselect').OutputSelector<
  any,
  any,
  (res: any) => any
>;
export declare const reducerSelector: (state: any, namespace: string) => any;
export declare function spins(state: any, type: string): any;
export declare function querys(state: any, type: string): any;
export declare function dicts(state: any, type: string, value: any): any;
export declare function containerSelector(
  namespace: string,
  props: object
): import('reselect').Selector<
  unknown,
  {
    appReducer: any;
    fetchingReducer: any;
    reducer: any;
    item: any;
    items: any[];
  }
>;
export {
  reducerModel,
  reducerListSelector,
  reducerItemSelector,
  reducerPageSelector
};
