import pk, {attr, fk, SessionBoundModel, oneToOne, many} from 'redux-orm';
import 'reflect-metadata';

const AttrSet = (setting?: object | string) => (
  target: any,
  propertyKey: string
) => {
  let fieldsSetting = {};
  if (typeof setting == 'string') {
    fieldsSetting = Object.assign({fieldName: setting});
  } else {
    fieldsSetting = Object.assign({fieldName: propertyKey}, setting);
  }
  Reflect.defineMetadata(propertyKey, fieldsSetting, target.constructor);
  // target.constructor.fields[propertyKey] = attr(fieldsSetting);
  target.constructor.fields = Object.assign({}, target.constructor.fields, {
    [propertyKey]: attr(fieldsSetting)
  });
};

const PkSet = (setting?: object | string) => (
  target: any,
  propertyKey: string
) => {
  target.constructor.options = {
    ...target.constructor.options,
    idAttribute: propertyKey
  };
};

interface fkType {
  to: string;
  relatedName: string;
}

const FkSet = (setting: fkType) => (target: any, propertyKey: string) => {
  // console.log('pk in dec');
  // const fieldsSetting = Object.assign({}, setting, {method: fk});
  // commonReflectSet(propertyKey, target.constructor, fieldsSetting);
  target.constructor.fields = Object.assign({}, target.constructor.fields, {
    [propertyKey]: fk(setting)
  });
};

const ManySet = (setting: any, relatedName: string) => (
  target: any,
  propertyKey: string
) => {
  // console.log('pk in dec');
  // const fieldsSetting = Object.assign({}, setting, {method: fk});
  // commonReflectSet(propertyKey, target.constructor, fieldsSetting);
  target.constructor.fields = Object.assign({}, target.constructor.fields, {
    [propertyKey]: many(setting, relatedName)
  });
};

const OneSet = (setting: any, relatedName: string) => (
  target: any,
  propertyKey: string
) => {
  // console.log('pk in dec');
  // const fieldsSetting = Object.assign({}, setting, {method: fk});
  // commonReflectSet(propertyKey, target.constructor, fieldsSetting);
  target.constructor.fields = Object.assign({}, target.constructor.fields, {
    [propertyKey]: oneToOne(setting, relatedName)
  });
};

export {
  FkSet as fk,
  PkSet as pk,
  AttrSet as attr,
  ManySet as many,
  OneSet as oneToOne
};
