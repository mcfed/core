import * as fetchingMiddleware from './fetching';
import * as moduleMiddleware from './redux-module';
import * as passportMiddleware from './redux-passport';
//@ts-ignore
export {fetchingMiddleware, moduleMiddleware, passportMiddleware};

export class MiddlewareFactory {
  fetchReq(payload: any) {}
  fetchRes(payload: any) {}
  fetchParams() {}
  fetchReset() {}
  showSuccess() {}
  showError() {}
  refreshPage() {}
  goBack() {}
  push() {}
  fetchConfig() {}
  fetchLogouting() {}
  fetchLogining() {}
  upgradeDict() {}
  upgradeBizcode() {}
  upgradeConfig() {}
  upgradeUser() {}
  upgradeAuths() {}
}
