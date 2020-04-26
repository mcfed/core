import pk, {attr, fk, SessionBoundModel} from 'redux-orm';
import 'reflect-metadata';
import {Constructor} from '../../InjectFactory/index';
import {StringableActionCreator} from 'redux-saga/effects';

function utilIsAttrWithFkExist(method: any, fieldsSettings: []) {
  return (
    (method === attr &&
      fieldsSettings.filter((item: any) => item.method === fk).length === 0) ||
    method === fk
  );
}

const commonReflectSet = (
  propertyKey: string,
  constructor: any,
  fieldsSetting: object
) => {
  if (Reflect.hasMetadata(propertyKey, constructor)) {
    const data = Reflect.getMetadata(propertyKey, constructor);
    Reflect.defineMetadata(propertyKey, [...data, fieldsSetting], constructor);
  } else {
    Reflect.defineMetadata(propertyKey, [fieldsSetting], constructor);
  }
};

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
  target.constructor.fields[propertyKey] = attr(fieldsSetting);
};

const PkSet = (setting?: object | string) => (
  target: any,
  propertyKey: string
) => {
  target.constructor.options.idAttribute = propertyKey;
};

interface fkType {
  to: string;
  relatedName: string;
}

const FkSet = (setting: fkType) => (target: any, propertyKey: string) => {
  // console.log('pk in dec');
  // const fieldsSetting = Object.assign({}, setting, {method: fk});
  // commonReflectSet(propertyKey, target.constructor, fieldsSetting);
  target.constructor.fields[propertyKey] = fk(setting);
};

export {
  FkSet as fk,
  PkSet as pk,
  AttrSet as attr,
  FkSet,
  PkSet,
  AttrSet,
  utilIsAttrWithFkExist
};
