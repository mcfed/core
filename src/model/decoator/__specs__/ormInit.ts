import {AnyAction} from 'redux';
import {ProxyModel, pk, fk, attr, BaseModel} from '../index';
import {orm} from '../../index';

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
  get getServerIp() {
    //@ts-ignore
    return 'http://' + this.serverIp;
  }
  get getServerAddress() {
    console.log(this.serverIp, this.serverPort);
    //@ts-ignore
    return [this.serverIp, this.serverPort].join(':');
  }

  get getServerStatusStr() {
    //@ts-ignore
    return this.serverStatus === '1' ? '启用' : '禁用';
  }
  getServerStatusIp() {
    //@ts-ignore
    return this.serverStatus + this.serverIp;
  }
}

class TestPropModel extends BaseModel {
  static modelName = 'TestPropModel';
  id!: String;
  props2!: String;
  Props1!: String;
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

export {TestModel};

orm.register(TestModel, TestPropModel, ReducerModel, ReducerChangeModel);
let session = orm.session({
  TestModel: {
    items: [],
    itemsById: {},
    meta: {}
  },
  TestPropModel: {
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

export {session};
describe('it', () => {
  it('test', () => {
    expect(true).toBe(true);
  });
});
