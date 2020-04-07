'use strict';
/**
 * @module Utils
 */
Object.defineProperty(exports, '__esModule', {value: true});
var Dict = /** @class */ (function() {
  function Dict() {}
  return Dict;
})();
var DictsModel = /** @class */ (function() {
  function DictsModel() {}
  return DictsModel;
})();
exports.DictsModel = DictsModel;
/**
 * getDictList - description
 *
 * @param  {object} dictData 字典表json
 * @param  {string} dicName  对应字典键名
 * @return {array}          对应字典值
 */
function getDictList(dictData, dicName) {
  // console.log(dictData)
  return (dictData && dictData[dicName]) || [];
}
exports.getDictList = getDictList;
/**
 * getDictLabel - description
 *
 * @param  {object} dictData 字典表json
 * @param  {string} dicName  对应字典键名
 * @param  {string|number} value    需要翻译的值
 * @return {type}          字典翻译后的值
 */
function getDictLabel(dictData, dicName, value) {
  var label = '';
  // try {
  var map = getDictList(dictData, dicName);
  map.forEach(function(arr) {
    if (arr.value === value) {
      label = arr.label;
    }
  });
  // } catch (e) {
  //   console.log(e);
  // }
  return label;
}
exports.getDictLabel = getDictLabel;
