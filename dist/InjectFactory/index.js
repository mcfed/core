'use strict';
var __spreadArrays =
  (this && this.__spreadArrays) ||
  function() {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++)
      s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
      for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
        r[k] = a[j];
    return r;
  };
Object.defineProperty(exports, '__esModule', {value: true});
require('reflect-metadata');
exports.Injectable = function(target) {};
exports.Factory = function(target) {
  // 获取所有注入的服务
  var providers = Reflect.getMetadata('design:paramtypes', target) || []; // [OtherService]
  // console.lo,target)
  // console.log(providers);
  var args = providers.map(function(provider) {
    // return new provider(new)
    return exports.Factory(provider);
  });
  // console.log(args)
  return new (target.bind.apply(target, __spreadArrays([void 0], args)))();
};
exports.ActionFactory = function(target, store) {
  var providers = Reflect.getMetadata('design:paramtypes', target) || []; // [OtherService]
  // console.lo,target)
  var args = providers.map(function(provider) {
    var instance = null;
    // if (Object.getPrototypeOf(provider) === BaseReducer) {
    //   instance = useActionProxy(new provider(), store);
    // } else {
    instance = new provider();
    // }
    return instance;
  });
  return new (target.bind.apply(target, __spreadArrays([void 0], args)))();
};
