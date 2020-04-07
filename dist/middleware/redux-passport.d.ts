export declare function fetchLogining(
  payload: any
): {
  type: string;
  payload: any;
};
export declare function fetchLogouting(
  payload: any
): {
  type: string;
  payload: any;
};
export declare function fetchConfig(
  payload: any
): {
  type: string;
  payload: any;
};
export default function createPassport({
  loginingProcess,
  logoutingProcess,
  globalProcess
}: any): ({getState, dispatch}: any) => (next: any) => (action: any) => any;
