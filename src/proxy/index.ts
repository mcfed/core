import 'reflect-metadata';
import {Store, Reducer, Dispatch} from 'redux';
import {resolve} from 'dns';

export type Constructor<T = any> = new (...args: any[]) => T;

function getProperty<T, K extends keyof T>(o: T, name: K): T[K] {
  return o[name]; // o[name] is of type T[K]
}
/**
 * 自定义类代理,兼容IE 不支持 Proxy
 */
export class ClassProxy {
  constructor(target: any, config: any) {
    //@ts-ignore
    if (global.Proxy) {
      return new Proxy(target, config);
    } else {
      return this.customProxy(target, config);
    }
  }
  getPropertyNames(target: Object) {
    return Object.getOwnPropertyNames(Object.getPrototypeOf(target)).concat(
      Object.getOwnPropertyNames(Object.getPrototypeOf(target).__proto__)
    );
  }
  customProxy(target: any, config: any) {
    const props = this.getPropertyNames(target).filter(
      x => x !== 'constructor'
    );
    const newTarget = Object.create({});
    props.map(function(name) {
      Object.defineProperty(newTarget, name, {
        configurable: false,
        writable: true,
        enumerable: true,
        value: config.get(target, name)
      });
    });

    return newTarget;
  }
}

/**
 * 使用Action代理,调用方法自动 dispatch 方法
 * @param target  目录类
 * @param dispatch store.dispatch
 * @param namespace 命名空间,即前缀
 */
export function useActionProxy<T extends object>(
  target: T,
  dispatch: Dispatch,
  namespace: string = target.constructor.name
): T {
  //@ts-ignore
  return new ClassProxy(target, {
    get: function(newTarget: T, prop: keyof T) {
      return function(payload: Object) {
        dispatch({
          type: [namespace, prop].join('/'),
          payload,
          meta: {
            method: prop
          }
        });
      };
    }
  });
}

/**
 * 将普通对象转成Reducer对象代理,调用 getReducer 获取 reducer 方法
 * @param target 目标类
 * @param store Store
 */

export function reduxActionProxy<T extends object>(
  target: T,
  store?: Store,
  namespace?: String
): T {
  // const instance = new target();
  //@ts-ignore
  return new ClassProxy(target, {
    get: function(newTarget: T, prop: keyof T) {
      if (prop === 'getReducer') {
        return (): Reducer =>
          //@ts-ignore
          function(state: Object = target.initalState, action: any) {
            const prop = action.meta?.method;
            //@ts-ignore
            if (
              action.type.indexOf(namespace) >= 0 &&
              prop !== undefined &&
              newTarget[prop]
            ) {
              return {
                ...state,
                //@ts-ignore
                ...getProperty(target, prop)(action.payload, state)
              };
            } else {
              return state;
            }
          };
      } else if (prop == 'select') {
        //@ts-ignore
        // console.log(newTarget.getReducer())
        return (callback: Function) =>
          new Promise((resolve, reject) => {
            resolve(callback(store?.getState()));
          });
      } else if (newTarget[prop] !== undefined) {
        return function(payload: Object) {
          //@ts-ignore
          return getProperty(target, prop)(payload);
        };
      }
    }
  });
}

/**
 * 创建ActionProxy代理对象,发起dispatch
 * @param target
 * @param dispatch store.dispatch
 */
export function createActionProxy<T extends object>(
  target: Constructor<T>,
  dispatch: Dispatch
): Constructor<T> {
  return new Proxy<any>(target, {
    construct(target, args: any) {
      const [oneArg, twoArg] = args;
      return new target(useActionProxy(oneArg, dispatch), twoArg);
    }
  });
}
