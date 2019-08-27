import {ModuleSaga, ModuleAction, ModuleMiddleware} from 'mcf-module';
// import {ModuleSaga,ModuleMiddleware,ModuleRouter,ModuleAction} from 'mcf-module'
import {reducerActions} from './reducer';
import {namespace} from './model';
import * as Api from './api';

const {showSuccess, showError} = ModuleMiddleware;
const {
  defaultSaga,
  takeSagas,
  effects: {call, put}
} = ModuleSaga;
// const { goBack } = ModuleRouter
const {createDefineActions} = ModuleAction;

export const saga = Object.assign(defaultSaga(reducerActions, Api, namespace), {
  changeState: function*(action) {
    let result;
    if (action.payload.status === 0) {
      result = yield call(Api.fetchDisable, action.payload);
    } else {
      result = yield call(Api.fetchEnable, action.payload);
    }
    if (result.code === 0) {
      yield put(showSuccess());
      yield call(saga.refreshPage);
    } else {
      yield put(showError(result.message));
    }
  },
  resetPwd: function*(action) {
    const result = yield call(Api.fetchReset, action.payload);
    if (result.code === 0) {
      yield put(showSuccess());
      yield call(saga.refreshPage);
    } else {
      yield put(showError(result.message));
    }
  }
});

export const sagaActions = createDefineActions(saga, namespace);
export default function*() {
  yield takeSagas(sagaActions, saga);
}
