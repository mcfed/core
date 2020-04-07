import {Action} from 'redux';
export declare function fetchReq(
  payload: Action
): {
  type: string;
  payload: Action<any>;
};
export declare function fetchRes(
  payload: any
): {
  type: string;
  payload: any;
};
export declare function fetchParams(
  payload: any
): {
  type: string;
  payload: any;
};
export declare function fetchReset(
  payload: any
): {
  type: string;
};
declare function fetchingReducer(
  state:
    | {
        fetching: Map<any, any>;
        params: Map<any, any>;
      }
    | undefined,
  {type, payload}: any
): {
  fetching: Map<any, any>;
  params: Map<any, any>;
};
export {fetchingReducer};
