//@ts-nocheck
import {Injectable} from '../../InjectFactory';
import Reducer from './reducer';
import Api from './api';
import Middleware from './middleware';
//const { Injectable } = InjectFactory;
@Injectable
class CarAction {
  constructor(
    public readonly reducer: Reducer,
    public readonly api: Api,
    public readonly middlewares: Middleware
  ) {}
  fetchDelete(ids: any): void {
    throw new Error('Method not implemented.');
  }
  stop(payload: {a: string; b: number}) {
    console.log('stop', payload.a, payload.b);
  }
  fetchItem() {
    throw new Error('Method not implemented.');
  }
  async fetchPage() {
    //@ts-ignore
    //console.log(1,this.middlewares.fetchLogining(),this.middlewares.fetchLogouting(),this.reducer,this.api,this.middlewares)
    // const aa= new Api()
    // const bb= new Reducer()
    const result = await this.api.fetchList({});
    //this.reducer.saveList(result.data)
    // console.log(11,aa.fetchList,bb.saveItem(),bb.saveList(result))
    console.log('this.middlewares', this.middlewares, this);
    //return result
  }
}

export {CarAction};
