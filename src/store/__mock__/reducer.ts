// import {namespace} from './model';
// export default function mock() {
//   return {};
// }
const FETCH_PARAMS = '@@MIDDLEWARE/FETCH_PARAMS';
const FETCH_REQ = '@@MIDDLEWARE/FETCH_REQ';
const FETCH_RES = '@@MIDDLEWARE/FETCH_RES';
const FETCH_RESET = '@@MIDDLEWARE/RESET';

// export default function fetchLogining(payload: any) {
//   const FETCH_LOGINING = '@@MIDDLEWARE/FETCH_LOGINING';
//   return {
//     type: FETCH_LOGINING,
//     payload: payload
//   };
// }

//const initialState = null;
// export default function fetchParams(payload: any) {
//   //console.log(5566,payload)
//   return {
//     type: FETCH_PARAMS,
//     payload
//   };
// }

// const initialState = null;
// export default function fetchParams(state = initialState, action:any){
//         switch(action){
//             case 'USER_SHORTCUT_FETCH_DATA_SUCCESS':{
//                 return state;
//             }
//             default:{
//                return state // We return the default state here
//             }
//         }
// }

//import { ICarReducer, IReducerState } from "./interface";

export default class CarReducer {
  private initalState = {
    page: {
      pageSize: 10,
      total: 0
    }
  };
  saveItem() {
    return {};
  }
  saveList(data: any) {
    return {};
  }
  getReducer() {}
}
