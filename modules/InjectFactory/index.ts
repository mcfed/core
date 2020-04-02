import 'reflect-metadata';
// import {useActionProxy} from '../proxy/index';
import {Store} from 'redux';

export type Constructor<T = any> = new (...args: any[]) => T;

export const Injectable = <T>(target: Constructor<T>) => {};

export const Factory = <T>(target: Constructor<T>): T => {
  // 获取所有注入的服务

  const providers = Reflect.getMetadata('design:paramtypes', target) || []; // [OtherService]
  // console.lo,target)
  // console.log(providers);
  const args = providers.map((provider: Constructor) => {
    // return new provider(new)
    return Factory(provider);
  });
  // console.log(args)
  return new target(...args);
};

export const ActionFactory = <T>(target: Constructor<T>, store: Store): T => {
  const providers = Reflect.getMetadata('design:paramtypes', target) || []; // [OtherService]
  // console.lo,target)
  const args = providers.map((provider: Constructor) => {
    let instance = null;
    // if (Object.getPrototypeOf(provider) === BaseReducer) {
    //   instance = useActionProxy(new provider(), store);
    // } else {
    instance = new provider();
    // }
    return instance;
  });
  return new target(...args);
};
