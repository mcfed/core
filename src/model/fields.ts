import pk, {attr, fk, SessionBoundModel} from 'redux-orm';
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

export {FkSet as fk, PkSet as pk, AttrSet as attr, FkSet, PkSet, AttrSet};
