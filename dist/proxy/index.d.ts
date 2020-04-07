import 'reflect-metadata';
import {Store} from 'redux';
export declare type Constructor<T = any> = new (...args: any[]) => T;
export declare function useActionProxy<T extends object>(
  target: T,
  store: Store
): T;
export declare function reduxActionProxy<T extends object>(target: T): T;
export declare function createActionProxy<T extends object>(
  target: Constructor<T>,
  store: Store
): Constructor<T>;
