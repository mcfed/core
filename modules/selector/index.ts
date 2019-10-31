import {createSelector, createStructuredSelector} from 'reselect';
import {getDictList, getDictLabel} from './utils';
import {reducerModel,
  reducerListSelector,
  reducerItemSelector,
  reducerListSelectorFilter,
  reducerPageSelector} from './reducerSelector'


export const fetchingStructured = (state: any) => state.fetchingReducer;
export const appStructured = (state: any) => state.appSelector;


export const spinsSelector = createSelector(
  [fetchingStructured],
  selector => {
    return selector.fetching;
  }
);
export const querysSelector = createSelector(
  [fetchingStructured],
  selector => {
    return selector.params;
  }
);

export const dictsSelector = createSelector(
  [appStructured],
  selector => {
    return selector.dicts;
  }
);

export const reducerSelector = (state:any,namespace:string)=>state[namespace]


export function spins(state:any,type:string) {
  return createSelector(
    [spinsSelector],
    spins => {
      return spins.get(type.toString ? type.toString() : type);
    }
  )(state);
}

export function querys(state:any,type:string) {
  return createSelector(
    [querysSelector],
    querys => {
      return querys.get(type.toString ? type.toString() : type) || {};
    }
  )(state);
}

export function dicts(state:any,type: string, value: any) {
  const args = arguments;
  return createSelector(
    [dictsSelector],
    dicts => {
      if (args.length > 2) {
        return getDictLabel(dicts, type, value);
      } else if (args.length == 2) {
        return getDictList(dicts, type);
      }else{
        return dicts
      }
      return '';
    }
  )(state);
}


export function crudStructuredSelector(namespace:string,props:object){
  //@ts-ignore
  let id = ""
  //@ts-ignore
  if(props && props.match && props.match.params){
    //@ts-ignore
    id = props.match.params
  }
  return createStructuredSelector({
    appReducer: appStructured,
    fetchingReducer: fetchingStructured,
    reducer:(state:any) =>reducerSelector(state,namespace),
    item: (state:any)=>reducerItemSelector(state,namespace,id),
    items:(state:any)=>reducerListSelector(state,namespace)
  })
}

export function containerStructuredSelector(state:any){
  return {
    querys:(type:string)=>querys(state,type),
    spins:(type:string)=>spins(state,type),
    dicts:(type:string,value:any)=>dicts(state,type,value)
  }
}

export {
  reducerModel,
  reducerListSelector,
  reducerItemSelector,
  reducerListSelectorFilter,
  reducerPageSelector
}
