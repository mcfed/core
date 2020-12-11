import 'reflect-metadata';
import {Store, Dispatch} from 'redux';
import {useActionProxy} from '../proxy';
import {MiddlewareFactory} from '../middleware';

export type Constructor<T = any> = new (...args: any[]) => T;
/**
 * 自动注入
 * @param target
 */
export const Injectable = <T>(target: Constructor<T>) => {};

/**
 * 自动注入工厂类,可实现递归注入
 * @param target 类对象
 */
export const Factory = <T>(target: Constructor<T>): T => {
  // 获取所有注入的服务

  const providers = Reflect.getMetadata('design:paramtypes', target) || []; // [OtherService]
  const args = providers.map((provider: Constructor) => {
    return Factory(provider);
  });
  // console.log(args)
  return new target(...args);
};
/**
 * Action注入工厂类
 * @param target 类对象
 */
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
    } else if (provider === Object) {
      instance = useActionProxy(
        new MiddlewareFactory(),
        dispatch,
        '@@MIDDLEWARE'
      );
    } else {
      instance = new provider();
    }
    return instance;
  });
  return new target(...args);
};
