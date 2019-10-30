import {createSelector} from 'reselect';
import {getDictList, getDictLabel} from './utils';
export {
  reducerItemSelector,
  reducerListSelector,
  reducerModel,
  reducerPageSelector,
  reducerListSelectorFilter
} from './reducerSelector';

export const fetchingSelector = (state: any) => state.fetchingReducer;
export const appSelector = (state: any) => state.appSelector;

export const spinsSelector = createSelector(
  [fetchingSelector],
  selector => {
    return selector.fetching;
  }
);
export const querysSelector = createSelector(
  [fetchingSelector],
  selector => {
    return selector.params;
  }
);

export const dictsSelector = createSelector(
  [appSelector],
  selector => {
    return selector.dicts;
  }
);

export function spins(type: Function | string) {
  return createSelector(
    [spinsSelector],
    spins => {
      return spins.get(type.toString ? type.toString() : type);
    }
  );
}

export function querys(type: Function | string) {
  return createSelector(
    [querysSelector],
    querys => {
      return querys.get(type.toString ? type.toString() : type) || {};
    }
  );
}

export function dicts(type: string, value: any) {
  const args = arguments;
  return createSelector(
    [dictsSelector],
    dicts => {
      if (args.length > 1) {
        return getDictLabel(dicts, type, value);
      } else if (args.length == 1) {
        return getDictList(dicts, type);
      }
      return '';
    }
  );
}
