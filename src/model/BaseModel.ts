import {Model, ModelFieldMap, ManyToMany, SessionBoundModel} from 'redux-orm';
import {AnyAction} from 'redux';

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
function initialsToUpperCase(str: string): string {
  return str
    .slice(0, 1)
    .toUpperCase()
    .concat(str.slice(1));
}

class BaseModel extends Model {
  private static virtualFields?: any;
  static reducers = {};
  constructor(props: any) {
    super(props);
  }

  initFields(props: any) {
    const _this = this;
    Object.keys(props).forEach(fieldName => {
      if (fieldName in this) {
        Object.defineProperty(this, fieldName, {
          //@ts-ignore
          get: () => this._fields[fieldName],
          set: value => this.set(fieldName, value),
          configurable: true,
          enumerable: true
        });
      }
    });
  }

  _initFields(props: any) {
    const propsObj = Object(props);
    //@ts-ignore
    this._fields = {...propsObj};

    // Object.keys(propsObj).forEach(fieldName => {
    //   // In this case, we got a prop that wasn't defined as a field.
    //   // Assuming it's an arbitrary data field, making an instance-specific
    //   // descriptor for it.
    //   // Using the in operator as the property could be defined anywhere
    //   // on the prototype chain.

    //   if (fieldName in this) {
    //     Object.defineProperty(this, fieldName, {
    //       //@ts-ignore
    //       get: () => this._fields[fieldName],
    //       set: value => this.set(fieldName, value),
    //       configurable: true,
    //       enumerable: true
    //     });
    //   }
    // });
  }

  useGetMethod(fieldName: string, modelClass: any) {}

  //TODO 需要实现 parse ,不保存数据只做对象转换
  static parse(userProps: ModelFieldMap): SessionBoundModel {
    // if (typeof this._session === 'undefined') {
    //   throw new Error(
    //     [
    //       `Tried to create a ${this.modelName} model instance without a session. `,
    //       'Create a session using `session = orm.session()` and call ',
    //       `\`session["${this.modelName}"].create\` instead.`
    //     ].join('')
    //   );
    // }
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
}

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
      //@ts-ignore
      reducerCompleteJson[it](action, modelClass);
    }
  });
  return session.state;
};

export {BaseModel};
