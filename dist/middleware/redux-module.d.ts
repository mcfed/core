export declare function cancelTask(
  payload: any
): {
  type: string;
  payload: any;
};
export declare function upgradeDict(
  payload: any
): {
  type: string;
  payload: any;
};
export declare function upgradeBizcode(
  payload: any
): {
  type: string;
  payload: any;
};
export declare function upgradeConfig(
  payload: any
): {
  type: string;
  payload: any;
};
export declare function upgradeUser(
  payload: any
): {
  type: string;
  payload: any;
};
export declare function upgradeAuths(
  payload: any
): {
  type: string;
  payload: any;
};
declare function globalReducer(
  state:
    | {
        dicts: {};
        bizCodes: {};
        config: {};
        user: {};
        auths: {};
      }
    | undefined,
  {type, payload}: any
):
  | {
      dicts: any;
      bizCodes: {};
      config: {};
      user: {};
      auths: {};
    }
  | {
      bizCodes: any;
      dicts: {};
      config: {};
      user: {};
      auths: {};
    }
  | {
      config: any;
      dicts: {};
      bizCodes: {};
      user: {};
      auths: {};
    }
  | {
      user: any;
      dicts: {};
      bizCodes: {};
      config: {};
      auths: {};
    }
  | {
      auths: any;
      dicts: {};
      bizCodes: {};
      config: {};
      user: {};
    };
export default function globalMiddlware(): ({
  getState,
  dispatch
}: any) => (next: any) => (action: any) => void;
export {globalReducer};
