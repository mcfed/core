import {AnyAction} from 'redux';
import {ProxyModel, pk, fk, attr, BaseModel, orm} from '../index';

class TestModel extends BaseModel {
  constructor(props: any) {
    super(props);
    this.initFields(props);
  }
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

  setServerIp(orginVal: string) {
    return 'http://' + orginVal;
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
  constructor(props: any) {
    super(props);
    this.initFields(props);
  }
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
const emptyDBstate = orm.getEmptyState();
//@ts-ignore
let session = orm.session(...emptyDBstate);

describe('it', () => {
  it('test', () => {
    expect(true).toBe(true);
  });
});

export {session};
