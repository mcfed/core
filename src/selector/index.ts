import {createSelector, createStructuredSelector} from 'reselect';
import {getDictList, getDictLabel} from './utils';
import {
  reducerModel,
  reducerListSelector,
  reducerItemSelector,
  reducerPageSelector
} from './reducerSelector';

export const fetchingSelector = (state: any) => state.fetchingReducer;
export const appSelector = (state: any) => state.appReducer;

export const spinsSelector = createSelector(
  [fetchingSelector],
  (selector: any) => {
    return selector.fetching;
  }
);
export const querysSelector = createSelector(
  [fetchingSelector],
  (selector: any) => {
    return selector.params;
  }
);

export const dictsSelector = createSelector([appSelector], (selector: any) => {
  return selector.dicts;
});
/**
 * 获取指定reducer
 * @param state
 * @param namespace
 */
export const reducerSelector = (state: any, namespace: string) =>
  state[namespace];

/**
 * 获取指定求请状态
 * @param state
 * @param type
 */
export function spins(state: any, type: string) {
  return createSelector([spinsSelector], (spins: any) => {
    return spins.get(type);
  })(state);
}

/**
 * 查询
 * @param state
 * @param type
 */
export function querys(state: any, type: string) {
  return createSelector([querysSelector], (querys: any) => {
    return querys.get(type) || {};
  })(state);
}

export function dicts(state: any, type?: string, value?: any) {
  return createSelector([dictsSelector], (dicts: any) => {
    if (value !== null && typeof value !== 'undefined' && type) {
      return getDictLabel(dicts, type, value);
    } else if (type) {
      return getDictList(dicts, type);
    } else {
      return dicts;
    }
  })(state);
}

export function containerSelector(namespace: string, props: object) {
  let id = '';
  //@ts-ignore
  if (props && props.match && props.match.params) {
    //@ts-ignore
    id = props.match.params;
  }
  return createStructuredSelector({
    appReducer: appSelector,
    fetchingReducer: fetchingSelector,
    reducer: (state: any) => reducerSelector(state, namespace),
    item: (state: any) => reducerItemSelector(state, namespace, id),
    items: (state: any) => reducerListSelector(state, namespace)
  });
}

export {
  reducerModel,
  reducerListSelector,
  reducerItemSelector,
  reducerPageSelector
};
