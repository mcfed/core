'use strict';
var __extends =
  (this && this.__extends) ||
  (function() {
    var extendStatics = function(d, b) {
      extendStatics =
        Object.setPrototypeOf ||
        ({__proto__: []} instanceof Array &&
          function(d, b) {
            d.__proto__ = b;
          }) ||
        function(d, b) {
          for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        };
      return extendStatics(d, b);
    };
    return function(d, b) {
      extendStatics(d, b);
      function __() {
        this.constructor = d;
      }
      d.prototype =
        b === null
          ? Object.create(b)
          : ((__.prototype = b.prototype), new __());
    };
  })();
Object.defineProperty(exports, '__esModule', {value: true});
var redux_orm_1 = require('redux-orm');
var Attr = /** @class */ (function(_super) {
  __extends(Attr, _super);
  function Attr(opts) {
    var _this = _super.call(this, opts) || this;
    if (opts && typeof opts === 'string') {
      _this.fieldName = opts;
    }
    if (opts && opts.hasOwnProperty('getDefault')) {
      _this.getDefault = opts.getDefault;
    }
    if (opts && opts.hasOwnProperty('fieldName')) {
      _this.fieldName = opts.fieldName;
    }
    if (opts && opts.hasOwnProperty('get')) {
      _this.getMethod = opts.get;
    }
    if (opts && opts.hasOwnProperty('set')) {
      _this.setMethod = opts.set;
    }
    return _this;
  }
  Attr.prototype.createForwardsDescriptor = function(fieldName, model) {
    var getMethod = this.getMethod;
    var setMethod = this.setMethod;
    var mapperFieldName = this.fieldName || fieldName;
    return {
      get: function() {
        return getMethod
          ? //@ts-ignore
            getMethod.call(
              this,
              //@ts-ignore
              this._fields[mapperFieldName],
              this._fields
            )
          : //@ts-ignore
            //@ts-ignore
            this._fields[mapperFieldName];
      },
      set: function(value) {
        // console.log(mapperFieldName,setMethod)
        return setMethod
          ? setMethod.call(this, this.set(mapperFieldName, value))
          : this.set(mapperFieldName || fieldName, value);
      },
      enumerable: true,
      configurable: true
    };
  };
  return Attr;
})(redux_orm_1.Attribute);
exports.default = Attr;
function attr(opt) {
  return new Attr(opt);
}
exports.attr = attr;
