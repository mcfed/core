import {ORM, ORMOpts} from 'redux-orm';
import BaseModel from './BaseModel';
import Attr, {attr} from './Attr';
import {Model, fieldSetAttr, fieldSetPk, fieldSetFk} from './Model';
declare class ModelORM extends ORM {
  constructor(props: ORMOpts);
  getDatabase(): any;
}
declare const orm: any;
export {
  orm,
  ModelORM,
  BaseModel,
  Attr,
  attr,
  Model,
  fieldSetAttr,
  fieldSetPk,
  fieldSetFk
};
