import {createSelector} from 'reselect';

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

export function query(type: Function | string) {
  return createSelector(
    [querysSelector],
    querys => {
      return querys.get(type.toString ? type.toString() : type) || {};
    }
  );
}
