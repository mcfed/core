const FETCH_LOGINING = '@@MIDDLEWARE/fetchLogining';
const FETCH_LOGOUTING = '@@MIDDLEWARE/fetchLogouting';
const FETCH_CONFIG = '@@MIDDLEWARE/fetchConfig';

export interface IMWPassport {
  /**
   * 发起登出用户信息事件
   * @param payload 登出相关参数
   */
  fetchLogouting(payload: object): void;
  /**
   * 发起登录用户信息事件
   * @param payload 登录相关参数
   */
  fetchLogining(payload: object): void;
  /**
   * 发起全局配置请求发起
   * @param payload
   */
  fetchConfig(payload: object): void;
}

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
