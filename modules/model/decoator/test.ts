//@ts-ignore
import {ModuleModel} from 'mcf-module';
import 'reflect-metadata';
import pk, {fk, SessionBoundModel} from 'redux-orm';
import {AnyAction} from 'redux';
export const namespace = 'test';
const {attr, BaseModel} = ModuleModel;

// 注意1 get 函数this 字段名无法获取  需要this._fields.fieldName
// 注意2 get set  同一个字段函数名需保持一致
// 注意3 字段名和get set 函数名需要在字段基础上+get

type fieldSetType = {
  method: Function;
};

function format2Lower(string: string): string {
  return string.toLowerCase();
}

function translate2HumpSJtring(string: string) {
  return format2Lower(string.substring(0, 1)).concat(string.substring(1));
}

function isHasSameMethod(
  data: Array<fieldSetType>,
  fieldsSetting: fieldSetType
) {
  return (
    data.filter((it: fieldSetType) => it.method === fieldsSetting.method)
      .length > 0
  );
}

function isAttrWithFkExist(method: any, fieldsSettings: Array<fieldSetType>) {
  return (
    (method === attr &&
      fieldsSettings.filter((item: any) => item.method === fk).length === 0) ||
    method === fk
  );
}
//实现1 用存取器 get set 关键字设置get set 方法
function fieldSetter(
  dataKeys: Array<string>,
  propertyList: Array<string>,
  target: any
) {
  propertyList
    .filter(it => it !== 'constructor')
    .forEach(it => {
      const {enumerable, configurable, ...getAndSet} =
        Object.getOwnPropertyDescriptor(target.prototype, it) || {};
      const fieldName = it.substring(3); //默认规则 设置的fieldname 的get set 函数同名并在前多get
      const lowerFieldName = format2Lower(fieldName);

      // console.log(Object.getOwnPropertyDescriptor(target.prototype, it));

      // target = new Proxy(target, {
      //   get: (obj, propKey) => {
      //     return get ? get.call(target) : obj['_fields'][propKey];
      //   },
      //   set: (obj, propKey, value) => {
      //     set ? set.call(target) : (obj[propKey] = value);
      //   }
      // });

      const fieldSetting = Reflect.getMetadata(lowerFieldName, target)
        ?.filter((item: any) => {
          return item.method === attr;
        })
        .pop();
      if (fieldSetting) {
        const {mehtod, originKey, ...othersSetting} = fieldSetting;
        // console.log(othersSetting, descripor, fieldName);
        Object.assign(target.fields, BaseModel.fields, {
          [originKey]: attr({
            ...othersSetting,
            ...getAndSet
          })
        });
        Reflect.defineMetadata(
          lowerFieldName,
          Reflect.getMetadata(lowerFieldName, target).filter((it: any) => {
            it.method !== attr;
          }),
          target
        );
        // console.log(Reflect.getMetadata(lowerFieldName, target));
      } else {
        const humpFieldName = translate2HumpSJtring(fieldName);
        // console.log(target.serverName);
        //有疑问  如何在没有attr时 获取到原属性名
        Object.assign(target.fields, BaseModel.fields, {
          [humpFieldName]: attr({...getAndSet})
        });
      }
    });
}
//实现2  用属性方式 设置set get 函数
function fieldSetterField(
  dataKeys: Array<string>,
  propertyList: Array<string>,
  target: any
) {
  propertyList
    .filter(it => it !== 'constructor')
    .forEach(it => {
      const {value} =
        Object.getOwnPropertyDescriptor(target.prototype, it) || {};
      const fieldName = it.substring(3); //默认规则 设置的fieldname 的get set 函数同名并在前多get
      const methodType = it.substring(0, 3); //获取方法
      const lowerFieldName = format2Lower(fieldName);

      const fieldSetting = Reflect.getMetadata(lowerFieldName, target)
        ?.filter((item: any) => {
          return item.method === attr;
        })
        .pop();
      if (fieldSetting) {
        const {mehtod, originKey, ...othersSetting} = fieldSetting;
        // console.log(othersSetting, descripor, fieldName);
        Object.assign(target.fields, BaseModel.fields, {
          [originKey]: attr({
            ...othersSetting,
            [methodType]: value
          })
        });
        Reflect.defineMetadata(
          lowerFieldName,
          Reflect.getMetadata(lowerFieldName, target).filter((it: any) => {
            it.method !== attr;
          }),
          target
        );
        // console.log(Reflect.getMetadata(lowerFieldName, target));
      } else {
        const humpFieldName = translate2HumpSJtring(fieldName);
        // console.log(target.serverName);
        //有疑问  如何在没有attr时 获取到原属性名
        Object.assign(target.fields, BaseModel.fields, {
          [humpFieldName]: attr({[methodType]: value})
        });
      }
    });
}

function Model() {
  return (target: any) => {
    //获取类名作为modelName
    target.modelName = target.name;
    //获取get set 方法 得到fieldName 后合并attr 参数
    const dataKeys = Reflect.getMetadataKeys(target);
    const propertyList = Object.getOwnPropertyNames(target.prototype) || [];
    //对含有 set get 的字段处理 同时会处理该字段attr
    //实现1 调用
    fieldSetter(dataKeys, propertyList, target);
    //实现2 调用
    // fieldSetterField(dataKeys, propertyList, target);
    // console.log(dataKeys);
    //对剩余attr fk pk操作
    dataKeys.map(it => {
      const fieldsSettings = Reflect.getMetadata(it, target);
      // console.log(fieldsSettings);
      fieldsSettings.forEach((itemSet: any) => {
        const {method, originKey, ...others} = itemSet;
        if (isAttrWithFkExist(method, fieldsSettings)) {
          Object.assign(target.fields, BaseModel.fields, {
            [originKey]: method(others)
          });
        } else if (method === pk) {
          target.options.idAttribute = originKey;
        }
      });
    });
  };
}

const commonReflectSet = (
  propertyKey: string,
  consturctor: any,
  fieldsSetting: fieldSetType
) => {
  const lowerPropertyKey = format2Lower(propertyKey);
  let newFieldsSetting = Object.assign({}, fieldsSetting, {
    originKey: propertyKey
  });
  if (Reflect.hasMetadata(lowerPropertyKey, consturctor)) {
    //如果已经有保存数据
    let data = Reflect.getMetadata(lowerPropertyKey, consturctor);
    if (isHasSameMethod(data, fieldsSetting)) {
      //如果已经有同样的method 设置数据 则合并
      data = data.map((it: any) => {
        return it.method === fieldsSetting.method
          ? Object.assign({}, it, fieldsSetting)
          : it;
      });
      Reflect.defineMetadata(lowerPropertyKey, data, consturctor);
    } else {
      Reflect.defineMetadata(
        lowerPropertyKey,
        [...data, newFieldsSetting],
        consturctor
      );
    }
  } else {
    Reflect.defineMetadata(lowerPropertyKey, [newFieldsSetting], consturctor);
  }
};

const fieldSetAttr = (setting?: object | string) =>
  function(target: any, propertyKey: string) {
    const consturctor = target.constructor;
    let fieldsSetting = {method: attr};
    if (typeof setting == 'string') {
      fieldsSetting = Object.assign({fieldName: setting}, fieldsSetting);
    } else {
      fieldsSetting = Object.assign({}, setting, fieldsSetting);
    }
    commonReflectSet(propertyKey, consturctor, fieldsSetting);
  };

const fieldSetPk = (setting?: object) =>
  function(target: any, propertyKey: string) {
    const consturctor = target.constructor;
    const fieldsSetting = Object.assign({}, setting, {method: pk});
    commonReflectSet(propertyKey, consturctor, fieldsSetting);
  };
const fieldSetFk = (setting: object) =>
  function(target: any, propertyKey: string) {
    const consturctor = target.constructor;
    const fieldsSetting = Object.assign({}, setting, {method: fk});
    commonReflectSet(propertyKey, consturctor, fieldsSetting);
  };

BaseModel.reducers = {
  newItem: (action: AnyAction, modelClass: any) => {
    modelClass.create(action.payload);
  },
  savePage: (action: AnyAction, modelClass: any) => {
    modelClass
      .all()
      .toModelArray()
      .forEach((model: SessionBoundModel) => model.delete());
    action.payload.items.map((m: SessionBoundModel) => modelClass.create(m));
  },
  saveList: (action: AnyAction, modelClass: any) => {
    action.payload.items.map((m: SessionBoundModel) => modelClass.create(m));
  },
  updateItem: (action: AnyAction, modelClass: any) => {
    modelClass.withId(action.payload.id).update(action.payload);
  },
  saveItem: (action: AnyAction, modelClass: any) => {
    modelClass.upsert(action.payload);
  },
  deleteItem: (action: AnyAction, modelClass: any) => {
    const model = modelClass.withId(action.payload);
    model.delete();
  }
};
BaseModel.reducer = function(action: AnyAction, modelClass: any, session: any) {
  const modelName = modelClass.modelName;
  const reducerCompleteJson = Object.assign(
    {},
    BaseModel.reducers,
    this.reducers
  );
  Object.keys(reducerCompleteJson).forEach((it: string) => {
    if (action.type === ''.concat(modelName, '/', it)) {
      reducerCompleteJson[it](action, modelClass);
    }
  });
  return session.state;
};

export {Model, fieldSetAttr, fieldSetPk, fieldSetFk, fieldSetter};

//get set 方法如何与属性对应 1 加访问装饰器？ 2 函数名去掉get？
