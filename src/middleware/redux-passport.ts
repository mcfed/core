const FETCH_LOGINING = '@@MIDDLEWARE/fetchLogining';
const FETCH_LOGOUTING = '@@MIDDLEWARE/fetchLogouting';
const FETCH_CONFIG = '@@MIDDLEWARE/fetchConfig';

export function fetchLogining(payload: any) {
  return {
    type: FETCH_LOGINING,
    payload: payload
  };
}

export function fetchLogouting(payload: any) {
  return {
    type: FETCH_LOGOUTING,
    payload: payload
  };
}

export function fetchConfig(payload: any) {
  return {
    type: FETCH_CONFIG,
    payload: payload
  };
}

export default function createPassport({
  loginingProcess,
  logoutingProcess,
  globalProcess
}: any) {
  return ({getState, dispatch}: any) => (next: any) => (action: any) => {
    if (FETCH_LOGINING === action.type) {
      loginingProcess && loginingProcess(dispatch, action.payload);
    } else if (FETCH_LOGOUTING === action.type) {
      logoutingProcess && logoutingProcess(dispatch, action.payload);
    } else if (FETCH_CONFIG == action.type) {
      globalProcess && globalProcess(dispatch, action.payload);
    } else {
      return next(action);
    }
    return next(action);
  };
}
