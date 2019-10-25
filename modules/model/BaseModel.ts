import {
  Model,
  ManyToMany,
  Session,
  CreateProps,
  ModelFieldMap,
  SessionBoundModel
} from 'redux-orm';
//@ts-ignore
import {attr} from './Attr.ts';
import {AnyAction} from 'redux';
import {SessionState} from 'http2';

function normalizeEntity(entity: any) {
  if (
    entity !== null &&
    typeof entity !== 'undefined' &&
    typeof entity.getId === 'function'
  ) {
    return entity.getId();
  }

  return entity;
}

export default class BaseModel extends Model {
  private _fields: ModelFieldMap = {};
  private static _session?: any;
  private static virtualFields?: any;

  constructor(props: ModelFieldMap) {
    super(props);
    this._initFields(props);
    // if(props){
    //   this.init(props)
    // }
  }
  _initFields(props: ModelFieldMap): void {
    var _this = this;
    this._fields = Object.assign({}, props);
    for (var p in props) {
      let fieldName = p;
      if (
        !(fieldName in _this) === false &&
        !(fieldName in this.getClass().fields) === false
      ) {
      } else {
        Object.defineProperty(_this, fieldName, {
          get: function get() {
            return `please register the property before using：${fieldName} -->${
              this.getClass().modelName
            }`;
          },
          set: function set(value) {
            console.info(
              `please register the property before using：${fieldName} -->${
                this.getClass().modelName
              }`
            );
            // return _this.set(fieldName, value);
            return null;
          },
          configurable: true,
          enumerable: true
        });
      }
    }
    // });
  }
  static parse(userProps: ModelFieldMap): SessionBoundModel {
    if (typeof this._session === 'undefined') {
      throw new Error(
        [
          `Tried to create a ${this.modelName} model instance without a session. `,
          'Create a session using `session = orm.session()` and call ',
          `\`session["${this.modelName}"].create\` instead.`
        ].join('')
      );
    }
    const props = {...userProps};

    const m2mRelations: any = {};

    const declaredFieldNames = Object.keys(this.fields);
    const declaredVirtualFieldNames = Object.keys(this.virtualFields);

    declaredFieldNames.forEach(key => {
      const field = this.fields[key];
      const valuePassed = userProps.hasOwnProperty(key);
      if (!(field instanceof ManyToMany)) {
        if (valuePassed) {
          const value = userProps[key];
          props[key] = normalizeEntity(value);
          //@ts-ignore
        } else if (field.getDefault) {
          //@ts-ignore
          props[key] = field.getDefault();
        }
      } else if (valuePassed) {
        // If a value is supplied for a ManyToMany field,
        // discard them from props and save for later processing.
        m2mRelations[key] = userProps[key];
        delete props[key];
      }
    });

    // add backward many-many if required
    declaredVirtualFieldNames.forEach(key => {
      if (!m2mRelations.hasOwnProperty(key)) {
        const field = this.virtualFields[key];
        if (userProps.hasOwnProperty(key) && field instanceof ManyToMany) {
          // If a value is supplied for a ManyToMany field,
          // discard them from props and save for later processing.
          m2mRelations[key] = userProps[key];
          delete props[key];
        }
      }
    });

    // const newEntry = this.session.applyUpdate({
    //   action: CREATE,
    //   table: this.modelName,
    //   payload: props
    // });

    const ThisModel = this;
    const instance = new ThisModel(props);
    // instance._refreshMany2Many(m2mRelations); // eslint-disable-line no-underscore-dangle
    // this.instance =instance
    return instance;
  }
  /*
  save(){
    const newEntry = this.session.applyUpdate({
      action: CREATE,
      table: this.modelName,
      payload: props
    });
    this._refreshMany2Many(this);
  }
  */
  toData(): ModelFieldMap {
    return this._fields;
  }
}

BaseModel.reducer = function(
  action: AnyAction,
  modelClass: any,
  session: any
): SessionState {
  const modelName = modelClass.modelName;
  switch (action.type) {
    case `${modelName}/newItem`:
      modelClass.create(action.payload);
      break;

    case `${modelName}/savePage`:
      modelClass
        .all()
        .toModelArray()
        .forEach((model: SessionBoundModel) => model.delete());
      action.payload.items.map((m: SessionBoundModel) => modelClass.create(m));
      break;
    case `${modelName}/saveList`:
      action.payload.items.map((m: SessionBoundModel) => modelClass.create(m));
      break;
    case `${modelName}/updateItem`:
      modelClass.withId(action.payload.id).update(action.payload);
      break;
    case `${modelName}/saveItem`:
      modelClass.upsert(action.payload);
      break;
    case `${modelName}/deleteItem`:
      const model = modelClass.withId(action.payload);
      model.delete();
      break;
    default:
    //  console.log(modelClass,action.type)
  }
  return session.state;
};

BaseModel.modelName = 'BaseModel';
BaseModel.fields = {
  id: attr({fieldName: 'id'})
};
