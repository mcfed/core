import {createSelector, createStructuredSelector} from 'reselect';
import {getDictList, getDictLabel} from './utils';
import {
  reducerModel,
  reducerListSelector,
  reducerItemSelector,
  reducerPageSelector
} from './reducerSelector';

export const fetchingStructured = (state: any) => state.fetchingReducer;
export const appStructured = (state: any) => state.appReducer;

export const spinsSelector = createSelector(
  [fetchingStructured],
  (selector: any) => {
    return selector.fetching;
  }
);
export const querysSelector = createSelector(
  [fetchingStructured],
  (selector: any) => {
    return selector.params;
  }
);

export const dictsSelector = createSelector(
  [appStructured],
  (selector: any) => {
    return selector.dicts;
  }
);

export const reducerSelector = (state: any, namespace: string) =>
  state[namespace];

export function spins(state: any, type: string) {
  return createSelector([spinsSelector], (spins: any) => {
    return spins.get(type);
  })(state);
}

export function querys(state: any, type: string) {
  return createSelector([querysSelector], (querys: any) => {
    return querys.get(type) || {};
  })(state);
}

export function dicts(state: any, type: string, value: any) {
  const args = arguments;
  return createSelector([dictsSelector], (dicts: any) => {
    if (args.length > 2) {
      return getDictLabel(dicts, type, value);
    } else if (args.length == 2) {
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
    appReducer: appStructured,
    fetchingReducer: fetchingStructured,
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
