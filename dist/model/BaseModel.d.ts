import {Model, ModelFieldMap, SessionBoundModel} from 'redux-orm';
export default class BaseModel extends Model {
  private _fields;
  private static _session?;
  private static virtualFields?;
  constructor(props: ModelFieldMap);
  _initFields(props: ModelFieldMap): void;
  static parse(userProps: ModelFieldMap): SessionBoundModel;
  toData(): ModelFieldMap;
}
