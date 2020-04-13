import 'reflect-metadata';
import pk, {attr, oneToOne} from 'redux-orm';
import {Proxy as CoreProxy} from '../../index';
import {Constructor} from '../../proxy/index';

export function ProxyModel(
  target: any,
  originTarget: any,
  targetClass: any
): any {
  return new Proxy(target, {
    set: function(obj, prop, value) {
      // console.log('in set', Reflect.hasMetadata(prop, originTarget));
      if (Reflect.hasMetadata(prop, originTarget)) {
        obj._fields[prop] = value;
        return true;
      }
      //@ts-ignore
      obj[prop] = value;
      return true;
    },
    get: function(obj, prop) {
      // console.log(
      //   prop,
      //   Reflect.hasMetadata(prop, originTarget),
      //   Object.getOwnPropertyNames(targetClass.prototype)
      // );
      if (Reflect.hasMetadata(prop, originTarget)) {
        return obj._fields[Reflect.getMetadata(prop, originTarget).fieldName];
      }
      //@ts-ignore
      return obj._fields[prop];
    }
  });
}

// const Model = () => (target: any) => {
//   target.modelName = target.name;

//   const dataKeys = Reflect.getMetadataKeys(target);

//   const propertyList = Object.getOwnPropertyNames(target.prototype) || [];

//   dataKeys.map(it => {
//     const fieldsSettings = Reflect.getMetadata(it, target);
//     fieldsSettings.forEach((itemSetting: any) => {
//       const {method, ...others} = itemSetting;
//       if (utilIsAttrWithFkExist(method, fieldsSettings)) {
//         //@ts-ignore
//         target.fields[it] = method(others);
//       } else if (method === pk) {
//         target.options.idAttribute = it;
//       }
//     });
//   });
// };

// export default Model;
