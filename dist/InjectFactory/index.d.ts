import 'reflect-metadata';
import {Store} from 'redux';
export declare type Constructor<T = any> = new (...args: any[]) => T;
export declare const Injectable: <T>(target: Constructor<T>) => void;
export declare const Factory: <T>(target: Constructor<T>) => T;
export declare const ActionFactory: <T>(
  target: Constructor<T>,
  store: Store<any, import('redux').AnyAction>
) => T;
