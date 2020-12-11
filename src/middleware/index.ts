import * as fetchingMiddleware from './fetching';
import * as moduleMiddleware from './redux-module';
import * as passportMiddleware from './redux-passport';
import {Action} from 'redux';
import {LocationDescriptorObject, Path, LocationState} from 'history';
import {IMWFetch} from './fetching';
import {IMWPassport} from './redux-passport';
import {IMWModule} from './redux-module';

export {fetchingMiddleware, moduleMiddleware, passportMiddleware};

export {IMWPassport, IMWModule};
export interface IMWMessage {
  /**
   * 显示成功消息
   * @param msg 消息正文
   */
  showSuccess(msg: string): void;
  /**
   * 显示错误消息
   * @param msg 消息正文
   */
  showError(msg: string): void;
}

export interface IMWRouter {
  refreshPage(payload: {fn: Function; scope: Object}): void;
  /**
   * 返回上一页
   */
  goBack(): void;
  /**
   * 指定跳转路由页
   * @param payload
   */
  push(location: LocationDescriptorObject): void;

  /**
   * 替换路由
   * @param location
   */
  replace(location: LocationDescriptorObject): void;
  /**
   * 回退指定N次跳转前页面
   * @param n 次数
   */
  go(n: number): void;
}

export type IMiddleware = IMWFetch &
  IMWModule &
  IMWMessage &
  IMWRouter &
  IMWPassport;

export type IMiddlewareFactory<T = IMiddleware> = {
  [P in keyof T]?: T[P];
};

/**
 * MiddlewareFactory为代理类,能过ReduxProxyAction
 * 实现方法调用自动调用 distpatch @middleware/XXX 方法名
 */
export class MiddlewareFactory<M = IMiddleware>
  implements IMiddlewareFactory<IMiddleware> {
  /**
   * 请求状态开始
   * @param payload 请求方法
   */
  fetchReq(payload: Action): void {}
  /**
   * 请求状态结束
   * @param payload 请求方法
   */
  fetchRes(payload: Action): void {}
  /**
   * 保存请求参数
   * @param payload 请求方法
   */
  fetchParams(payload: Action): void {}
  /**
   * 重置请求参数为空
   */
  fetchReset(): void {}
}
