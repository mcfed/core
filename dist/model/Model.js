'use strict';
var __assign =
  (this && this.__assign) ||
  function() {
    __assign =
      Object.assign ||
      function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
          s = arguments[i];
          for (var p in s)
            if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
      };
    return __assign.apply(this, arguments);
  };
var __rest =
  (this && this.__rest) ||
  function(s, e) {
    var t = {};
    for (var p in s)
      if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === 'function')
      for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
        if (
          e.indexOf(p[i]) < 0 &&
          Object.prototype.propertyIsEnumerable.call(s, p[i])
        )
          t[p[i]] = s[p[i]];
      }
    return t;
  };
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
var __importStar =
  (this && this.__importStar) ||
  function(mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null)
      for (var k in mod)
        if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result['default'] = mod;
    return result;
  };
var __importDefault =
  (this && this.__importDefault) ||
  function(mod) {
    return mod && mod.__esModule ? mod : {default: mod};
  };
Object.defineProperty(exports, '__esModule', {value: true});
require('reflect-metadata');
var redux_orm_1 = __importStar(require('redux-orm'));
var BaseModel_1 = __importDefault(require('./BaseModel'));
var Attr_1 = require('./Attr');
exports.namespace = 'test';
function format2Lower(string) {
  return string.toLowerCase();
}
function translate2HumpSJtring(string) {
  return format2Lower(string.substring(0, 1)).concat(string.substring(1));
}
function isHasSameMethod(data, fieldsSetting) {
  return (
    data.filter(function(it) {
      return it.method === fieldsSetting.method;
    }).length > 0
  );
}
function isAttrWithFkExist(method, fieldsSettings) {
  return (
    (method === Attr_1.attr &&
      fieldsSettings.filter(function(item) {
        return item.method === redux_orm_1.fk;
      }).length === 0) ||
    method === redux_orm_1.fk
  );
}
//实现1 用存取器 get set 关键字设置get set 方法
function fieldSetter(dataKeys, propertyList, target) {
  propertyList
    .filter(function(it) {
      return it !== 'constructor';
    })
    .forEach(function(it) {
      var _a, _b;
      var _c;
      var _d = Object.getOwnPropertyDescriptor(target.prototype, it) || {},
        enumerable = _d.enumerable,
        configurable = _d.configurable,
        getAndSet = __rest(_d, ['enumerable', 'configurable']);
      var fieldName = it.substring(3); //默认规则 设置的fieldname 的get set 函数同名并在前多get
      var lowerFieldName = format2Lower(fieldName);
      var fieldSetting =
        (_c = Reflect.getMetadata(lowerFieldName, target)) === null ||
        _c === void 0
          ? void 0
          : _c
              .filter(function(item) {
                return item.method === Attr_1.attr;
              })
              .pop();
      if (fieldSetting) {
        var mehtod = fieldSetting.mehtod,
          originKey = fieldSetting.originKey,
          othersSetting = __rest(fieldSetting, ['mehtod', 'originKey']);
        // console.log(othersSetting, descripor, fieldName);
        Object.assign(
          target.fields,
          BaseModel_1.default.fields,
          ((_a = {}),
          (_a[originKey] = Attr_1.attr(
            __assign(__assign({}, othersSetting), getAndSet)
          )),
          _a)
        );
        Reflect.defineMetadata(
          lowerFieldName,
          Reflect.getMetadata(lowerFieldName, target).filter(function(it) {
            it.method !== Attr_1.attr;
          }),
          target
        );
        // console.log(Reflect.getMetadata(lowerFieldName, target));
      } else {
        var humpFieldName = translate2HumpSJtring(fieldName);
        // console.log(target.serverName);
        //有疑问  如何在没有attr时 获取到原属性名
        Object.assign(
          target.fields,
          BaseModel_1.default.fields,
          ((_b = {}),
          //@ts-ignore
          (_b[humpFieldName] = Attr_1.attr(__assign({}, getAndSet))),
          _b)
        );
      }
    });
}
//实现2  用属性方式 设置set get 函数
function fieldSetterField(dataKeys, propertyList, target) {
  propertyList
    .filter(function(it) {
      return it !== 'constructor';
    })
    .forEach(function(it) {
      var _a, _b, _c, _d;
      var _e;
      var value = (Object.getOwnPropertyDescriptor(target.prototype, it) || {})
        .value;
      var fieldName = it.substring(3); //默认规则 设置的fieldname 的get set 函数同名并在前多get
      var methodType = it.substring(0, 3); //获取方法
      var lowerFieldName = format2Lower(fieldName);
      var fieldSetting =
        (_e = Reflect.getMetadata(lowerFieldName, target)) === null ||
        _e === void 0
          ? void 0
          : _e
              .filter(function(item) {
                return item.method === Attr_1.attr;
              })
              .pop();
      if (fieldSetting) {
        var mehtod = fieldSetting.mehtod,
          originKey = fieldSetting.originKey,
          othersSetting = __rest(fieldSetting, ['mehtod', 'originKey']);
        // console.log(othersSetting, descripor, fieldName);
        Object.assign(
          target.fields,
          BaseModel_1.default.fields,
          ((_a = {}),
          (_a[originKey] = Attr_1.attr(
            __assign(
              __assign({}, othersSetting),
              ((_b = {}), (_b[methodType] = value), _b)
            )
          )),
          _a)
        );
        Reflect.defineMetadata(
          lowerFieldName,
          Reflect.getMetadata(lowerFieldName, target).filter(function(it) {
            it.method !== Attr_1.attr;
          }),
          target
        );
        // console.log(Reflect.getMetadata(lowerFieldName, target));
      } else {
        var humpFieldName = translate2HumpSJtring(fieldName);
        // console.log(target.serverName);
        //有疑问  如何在没有attr时 获取到原属性名
        Object.assign(
          target.fields,
          BaseModel_1.default.fields,
          ((_c = {}),
          (_c[humpFieldName] = Attr_1.attr(
            ((_d = {}), (_d[methodType] = value), _d)
          )),
          _c)
        );
      }
    });
}
function Model() {
  return function(target) {
    //获取类名作为modelName
    target.modelName = target.name;
    //获取get set 方法 得到fieldName 后合并attr 参数
    var dataKeys = Reflect.getMetadataKeys(target);
    var propertyList = Object.getOwnPropertyNames(target.prototype) || [];
    //对含有 set get 的字段处理 同时会处理该字段attr
    //实现1 调用
    fieldSetter(dataKeys, propertyList, target);
    //实现2 调用
    // fieldSetterField(dataKeys, propertyList, target);
    // console.log(dataKeys);
    //对剩余attr fk pk操作
    dataKeys.map(function(it) {
      var fieldsSettings = Reflect.getMetadata(it, target);
      // console.log(fieldsSettings);
      fieldsSettings.forEach(function(itemSet) {
        var _a;
        var method = itemSet.method,
          originKey = itemSet.originKey,
          others = __rest(itemSet, ['method', 'originKey']);
        if (isAttrWithFkExist(method, fieldsSettings)) {
          Object.assign(
            target.fields,
            BaseModel_1.default.fields,
            ((_a = {}), (_a[originKey] = method(others)), _a)
          );
        } else if (method === redux_orm_1.default) {
          target.options.idAttribute = originKey;
        }
      });
    });
  };
}
exports.Model = Model;
var commonReflectSet = function(propertyKey, consturctor, fieldsSetting) {
  var lowerPropertyKey = format2Lower(propertyKey);
  var newFieldsSetting = Object.assign({}, fieldsSetting, {
    originKey: propertyKey
  });
  if (Reflect.hasMetadata(lowerPropertyKey, consturctor)) {
    //如果已经有保存数据
    var data = Reflect.getMetadata(lowerPropertyKey, consturctor);
    if (isHasSameMethod(data, fieldsSetting)) {
      //如果已经有同样的method 设置数据 则合并
      data = data.map(function(it) {
        return it.method === fieldsSetting.method
          ? Object.assign({}, it, fieldsSetting)
          : it;
      });
      Reflect.defineMetadata(lowerPropertyKey, data, consturctor);
    } else {
      Reflect.defineMetadata(
        lowerPropertyKey,
        __spreadArrays(data, [newFieldsSetting]),
        consturctor
      );
    }
  } else {
    Reflect.defineMetadata(lowerPropertyKey, [newFieldsSetting], consturctor);
  }
};
var fieldSetAttr = function(setting) {
  return function(target, propertyKey) {
    var consturctor = target.constructor;
    var fieldsSetting = {method: Attr_1.attr};
    if (typeof setting == 'string') {
      fieldsSetting = Object.assign({fieldName: setting}, fieldsSetting);
    } else {
      fieldsSetting = Object.assign({}, setting, fieldsSetting);
    }
    commonReflectSet(propertyKey, consturctor, fieldsSetting);
  };
};
exports.fieldSetAttr = fieldSetAttr;
var fieldSetPk = function(setting) {
  return function(target, propertyKey) {
    var consturctor = target.constructor;
    var fieldsSetting = Object.assign({}, setting, {
      method: redux_orm_1.default
    });
    commonReflectSet(propertyKey, consturctor, fieldsSetting);
  };
};
exports.fieldSetPk = fieldSetPk;
var fieldSetFk = function(setting) {
  return function(target, propertyKey) {
    var consturctor = target.constructor;
    var fieldsSetting = Object.assign({}, setting, {method: redux_orm_1.fk});
    commonReflectSet(propertyKey, consturctor, fieldsSetting);
  };
};
exports.fieldSetFk = fieldSetFk;
//@ts-ignore
BaseModel_1.default.reducers = {
  newItem: function(action, modelClass) {
    modelClass.create(action.payload);
  },
  savePage: function(action, modelClass) {
    modelClass
      .all()
      .toModelArray()
      .forEach(function(model) {
        return model.delete();
      });
    action.payload.items.map(function(m) {
      return modelClass.create(m);
    });
  },
  saveList: function(action, modelClass) {
    action.payload.items.map(function(m) {
      return modelClass.create(m);
    });
  },
  updateItem: function(action, modelClass) {
    modelClass.withId(action.payload.id).update(action.payload);
  },
  saveItem: function(action, modelClass) {
    modelClass.upsert(action.payload);
  },
  deleteItem: function(action, modelClass) {
    var model = modelClass.withId(action.payload);
    model.delete();
  }
};
BaseModel_1.default.reducer = function(action, modelClass, session) {
  var modelName = modelClass.modelName;
  var reducerCompleteJson = Object.assign(
    {},
    //@ts-ignore
    BaseModel_1.default.reducers,
    //@ts-ignore
    this.reducers
  );
  Object.keys(reducerCompleteJson).forEach(function(it) {
    if (action.type === ''.concat(modelName, '/', it)) {
      reducerCompleteJson[it](action, modelClass);
    }
  });
  return session.state;
};
