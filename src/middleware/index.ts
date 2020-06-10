import * as fetchingMiddleware from './fetching';
import * as moduleMiddleware from './redux-module';
import * as passportMiddleware from './redux-passport';
import {Action} from 'redux';
import {LocationDescriptorObject} from 'history';
export {fetchingMiddleware, moduleMiddleware, passportMiddleware};
/**
 * MiddlewareFactory为代理类,能过ReduxProxyAction
 * 实现方法调用自动调用 distpatch @middleware/XXX 方法名
 */
export class MiddlewareFactory {
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
  /**
   * 显示成功消息
   * @param msg 消息正文
   */
  showSuccess(msg: string): void {}
  /**
   * 显示错误消息
   * @param msg 消息正文
   */
  showError(msg: string): void {}

  /**
   * 发起登出用户信息事件
   * @param payload 登出相关参数
   */
  fetchLogouting(payload: object): void {}
  /**
   * 发起登录用户信息事件
   * @param payload 登录相关参数
   */
  fetchLogining(payload: object): void {}
  /**
   * 发起全局配置请求发起
   * @param payload
   */
  fetchConfig(payload: object): void {}
  /**
   * 更新字典数据
   * @param dicts 字典对象
   */
  upgradeDict(dicts: Object): void {}
  /**
   * 更新业务码,即字典类似
   * @param bizCode 业务码对象
   */
  upgradeBizcode(bizCode: Object): void {}
  /**
   * 更新全局配置属性
   * @param config 配置对象
   */
  upgradeConfig(config: Object): void {}
  /**
   * 更新用户信息
   * @param user 用户对象
   */
  upgradeUser(user: Object): void {}
  /**
   * 更新权限信息
   * @param auths 权限信息
   */
  upgradeAuths(auths: Object): void {}
  /**
   * 刷新页面,需要绑定当前对象作用域
   * @param fn 指定刷新方法
   * @example refreshPage(this.fetchPage.bind(this))
   */
  refreshPage(fn: Function): void {}
  /**
   * 返回上一页
   */
  goBack(): void {}
  /**
   * 指定跳转路由页
   * @param payload
   */
  push(location: LocationDescriptorObject): void {}

  /**
   * 替换路由
   * @param location
   */
  replace(location: LocationDescriptorObject): void {}
  /**
   * 回退指定N次跳转前页面
   * @param n 次数
   */
  go(n: number) {}
}
