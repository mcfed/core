import {Model, SessionBoundModel} from 'redux-orm';
import {AnyAction} from 'redux';

class BaseModel extends Model {
  static reducers = {};

  //TODO 需要实现 parse ,不保存数据只做对象转换
  static parse(payload: any) {
    return {
      _fields: {}
    };
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
