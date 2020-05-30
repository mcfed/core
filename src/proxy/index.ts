import 'reflect-metadata';
import {Store, Reducer, Dispatch} from 'redux';

export type Constructor<T = any> = new (...args: any[]) => T;

function getProperty<T, K extends keyof T>(o: T, name: K): T[K] {
  return o[name]; // o[name] is of type T[K]
}

class ClassProxy {
  constructor(target: any, config: any) {
    //@ts-ignore
    if (global.Proxy) {
      return new Proxy(target, config);
    } else {
      return this.customProxy(target, config);
    }
  }
  getPropertyNames(target: Object) {
    return Object.getOwnPropertyNames(target.constructor.prototype);
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

export function reduxActionProxy<T extends object>(target: T): T {
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
            if (prop !== undefined && newTarget[prop]) {
              return {
                ...state,
                //@ts-ignore
                ...getProperty(target, prop)(action.payload, state)
              };
            } else {
              return state;
            }
          };
      } else if (newTarget[prop] !== undefined) {
        return function(payload: Object) {
          //@ts-ignore

          return getProperty(target, prop)(payload);
        };
      }
    }
  });
}

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
