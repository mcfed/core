/**
 * @module Utils
 */
declare class Dict<T> {
  label: string;
  value: any;
}
export declare class DictsModel<T> {
  [key: string]: Array<T>;
}
/**
 * getDictList - description
 *
 * @param  {object} dictData 字典表json
 * @param  {string} dicName  对应字典键名
 * @return {array}          对应字典值
 */
export declare function getDictList<T>(
  dictData: DictsModel<T>,
  dicName: string
): Array<T>;
/**
 * getDictLabel - description
 *
 * @param  {object} dictData 字典表json
 * @param  {string} dicName  对应字典键名
 * @param  {string|number} value    需要翻译的值
 * @return {type}          字典翻译后的值
 */
export declare function getDictLabel<T extends Dict<T>>(
  dictData: DictsModel<T>,
  dicName: string,
  value: any
): string;
export {};
