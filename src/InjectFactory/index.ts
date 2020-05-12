import 'reflect-metadata';
import {Store, Dispatch} from 'redux';
import {useActionProxy} from '../proxy';

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

export const ActionFactory = <T>(
  target: Constructor<T>,
  dispatch: Dispatch,
  namespace: string
): T => {
  const providers = Reflect.getMetadata('design:paramtypes', target) || []; // [OtherService]
  // console.lo,target)
  const args = providers.map((provider: Constructor) => {
    let instance = null;
    if (provider.prototype.hasOwnProperty('getReducer')) {
      instance = useActionProxy(new provider(), dispatch, namespace);
    } else {
      instance = new provider();
    }
    return instance;
  });
  return new target(...args);
};
