import {Injectable} from '../../InjectFactory/index';
import {Reducer} from 'redux';
export class Api {
  constructor() {}
  fetchItem() {
    console.log('fetchItem');
  }
}

export class CarReducer {
  static namespece = 'car';
  static initalState = {
    a: 1,
    page: {
      total: 0,
      current: 1,
      pageSize: 10
    }
  };
  getReducer(): Reducer {
    return (state: object) => state;
  }
  inital(payload: any) {
    return payload;
  }
  saveItem(payload: any) {
    return payload;
  }

  saveItem2(payload: {a: number}) {
    // console.log("saveItem2")
    return {a: payload.a + 1};
  }
}

@Injectable
export class CarSaga {
  static namespace = 'cac';

  constructor(public readonly reducer: CarReducer, public readonly api: Api) {}

  run() {
    this.api.fetchItem();
    this.start();
    this.reducer.saveItem({});
  }

  start() {
    console.log('start');
    // this.dispatch({type:"bbb"})
  }

  async stop(payload: {a: string; b: number}) {
    // console.log(this.api)
    await this.shift();
    // console.log(payload.a)
    // yield 1
  }

  async shift() {
    console.log('shift');
  }

  *jump() {
    console.log('jump');
  }
}
