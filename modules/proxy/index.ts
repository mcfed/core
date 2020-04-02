import 'reflect-metadata';
import {Store} from 'redux';

export type Constructor<T = any> = new (...args: any[]) => T;

function getProperty<T, K extends keyof T>(o: T, name: K): T[K] {
  return o[name]; // o[name] is of type T[K]
}

export function useActionProxy<T extends object>(target: T, store: Store): T {
  return new Proxy(target, {
    get: function(newTarget: T, prop: keyof T) {
      return function(payload: Object) {
        store.dispatch({
          type: [target.constructor.name, prop].join('/'),
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
  return new Proxy(target, {
    get: function(newTarget: T, prop: keyof T) {
      if (prop === 'getReducer') {
        return (): Reducer =>
          //@ts-ignore
          function(state: Object = target.initalState, action: any) {
            const prop = action.meta?.method;
            if (prop !== undefined) {
              return {
                ...state,
                //@ts-ignore
                ...getProperty(newTarget, prop)(action.payload, state)
              };
            } else {
              return state;
            }
          };
      } else if (newTarget[prop] !== undefined) {
        return function(payload: Object) {
          //@ts-ignore
          return getProperty(newTarget, prop)(payload);
        };
      }
    }
  });
}

export function createActionProxy<T extends object>(
  target: Constructor<T>,
  store: Store
): Constructor<T> {
  return new Proxy<any>(target, {
    construct(target, args: any) {
      const [oneArg, twoArg] = args;
      return new target(useActionProxy(oneArg, store), twoArg);
    }
  });
}
