const UPGRADE_DICT = '@@MIDDLEWARE/UPGRADE_DICT';
const UPGRADE_BIZCODE = '@@MIDDLEWARE/UPGRADE_BIZCODE';
const UPGRADE_CONFIG = '@@MIDDLEWARE/UPGRADE_CONFIG';
const UPGRADE_USER = '@@MIDDLEWARE/UPGRADE_USER';
const UPGRADE_AUTHS = '@@MIDDLEWARE/UPGRADE_AUTHS';
const CANCEL_TASK = '@@MIDDLEWARE/CANCEL_TASK';

export function cancelTask(payload: any) {
  return {
    type: CANCEL_TASK,
    payload
  };
}

export function upgradeDict(payload: any) {
  return {
    type: UPGRADE_DICT,
    payload: payload
  };
}

export function upgradeBizcode(payload: any) {
  return {
    type: UPGRADE_BIZCODE,
    payload: payload
  };
}

export function upgradeConfig(payload: any) {
  return {
    type: UPGRADE_CONFIG,
    payload: payload
  };
}

export function upgradeUser(payload: any) {
  return {
    type: UPGRADE_USER,
    payload: payload
  };
}
export function upgradeAuths(payload: any) {
  return {
    type: UPGRADE_AUTHS,
    payload: payload
  };
}

function globalReducer(
  state = {
    dicts: {},
    bizCodes: {},
    config: {},
    user: {},
    auths: {}
  },
  {type, payload}: any
) {
  switch (type) {
    case UPGRADE_DICT:
      return {
        ...state,
        dicts: payload
      };
    case UPGRADE_BIZCODE:
      return {
        ...state,
        bizCodes: payload
      };
    case UPGRADE_CONFIG:
      return {
        ...state,
        config: Object.assign({}, state.config, payload)
      };
    case UPGRADE_USER:
      return {
        ...state,
        user: Object.assign({}, state.config, payload)
      };
    case UPGRADE_AUTHS:
      return {
        ...state,
        auths: Object.assign({}, state.config, payload)
      };
    default:
      return state;
  }
  //  return state
}

export default function globalMiddlware() {
  return ({getState, dispatch}: any) => (next: any) => (action: any) => {
    next(action);
  };
}

export {globalReducer};
