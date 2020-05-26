import 'reflect-metadata';
import {Store, Reducer, Dispatch} from 'redux';

export type Constructor<T = any> = new (...args: any[]) => T;

function getProperty<T, K extends keyof T>(o: T, name: K): T[K] {
  return o[name]; // o[name] is of type T[K]
}

export function useActionProxy<T extends object>(
  target: T,
  dispatch: Dispatch,
  namespace: string = target.constructor.name
): T {
  return new Proxy(target, {
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
  return new Proxy(target, {
    get: function(newTarget: T, prop: keyof T) {
      if (prop === 'getReducer') {
        return (): Reducer =>
          //@ts-ignore
          function(state: Object = target.initalState, action: any) {
            const prop = action?.meta?.method;
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
  dispatch: Dispatch
): Constructor<T> {
  return new Proxy<any>(target, {
    construct(target, args: any) {
      const [oneArg, twoArg] = args;
      return new target(useActionProxy(oneArg, dispatch), twoArg);
    }
  });
}
