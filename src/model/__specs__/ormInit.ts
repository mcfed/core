import {AnyAction} from 'redux';
import {ProxyModel, pk, fk, attr, BaseModel, orm} from '../index';

class TestModel extends BaseModel {
  static modelName = 'TestModel';
  @pk()
  id!: String;
  @attr()
  serverName!: String;

  @attr()
  serverStatus!: String;

  @attr()
  serverIp!: String;
  @attr()
  serverPort!: String;

  serverAddress!: String;

  @attr('serverPort')
  port!: Number;

  prop1!: String;

  @attr({fieldName: 'serverStatus'})
  serverStatusStr!: String;

  get getserverName() {
    return 'unname';
  }
  get getProp1() {
    return 111;
  }
  getServerIp() {
    //@ts-ignore
    return 'http://' + this._fields.serverIp;
  }
  get getServerPort() {
    return 111;
  }
  get getServerAddress() {
    //@ts-ignore
    return [this._fields.serverIp, this._fields.serverPort].join(':');
  }

  getServerStatus() {
    //@ts-ignore
    return this._fields.serverStatus === '1' ? '启用' : '禁用';
  }
  getServerStatusIp() {
    //@ts-ignore
    return this._fields.serverStatus + this._fields.serverIp;
  }
}

class ReducerModel extends BaseModel {
  static modelName = 'ReducerModel';
  id!: String;
  props2!: String;
  Props1!: String;
}

class ReducerChangeModel extends BaseModel {
  static modelName = 'ReducerChangeModel';
  static reducers = {
    newItem: (action: AnyAction, modelClass: any) => {
      modelClass.abc(action);
    },
    testReducer: (action: AnyAction, modelClass: any) => {
      modelClass.efg(action);
    }
  };
  id!: String;
  props2!: String;
  Props1!: String;
}
//@ts-ignore
orm.register(TestModel, ReducerModel, ReducerChangeModel);
//@ts-ignore
let session = orm.session({
  TestModel: {
    items: [],
    itemsById: {},
    meta: {}
  },
  ReducerModel: {
    items: [],
    itemsById: {},
    meta: {}
  },
  ReducerChangeModel: {
    items: [],
    itemsById: {},
    meta: {}
  }
});

describe('it', () => {
  it('test', () => {
    expect(true).toBe(true);
  });
});

export {session};
