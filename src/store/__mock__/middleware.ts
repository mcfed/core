import {Middleware} from 'redux';
//import { ICarReducer, IReducerState } from "./interface";
//import createPassport from "./ss";
import createPassport from '../../middleware/redux-passport';
import globalMiddlware from '../../middleware/redux-module';
//import {store} from '../app'
//const { dispatch } = store;
export default class CarReducer {
  createPassport() {
    return createPassport({});
  }
  globalMiddlware() {
    return globalMiddlware();
  }
}
