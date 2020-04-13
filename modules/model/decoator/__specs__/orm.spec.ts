//@ts-ignore
import {session, TestModel as TestModelClass} from './ormInit';
import {ProxyModel} from '../Model';

describe('ORM initial', () => {
  const Test = session.TestModel;

  var TestModel = Test.create({
    id: 'abc',
    // serverName: 'abd',
    serverStatus: '1',
    serverIp: '127.0.0.1',
    serverPort: '8080',
    ip: 'address'
  });
  //@ts-ignore
  const testModel = new ProxyModel(TestModel, Test, TestModelClass);
  // console.log(TestModel, Test, testModel);
  it('testModel serverStatusStr', done => {
    expect(testModel.serverStatusStr).toBe('启用');
    done();
  });

  it('testModel  serverName default {unname}', done => {
    expect(testModel.serverName).toBe('unname');
    done();
  });

  it('testModel serverIp has value ', done => {
    expect(testModel.serverIp).toBe('http://127.0.0.1');
    done();
  });

  it('testModel port <-serverPort ', done => {
    expect(testModel.port).toBe('8080');
    done();
  });

  it('testModel serverAddress = {serverIp}:{serverPort}', done => {
    expect(testModel.serverAddress).toBe('127.0.0.1:8080');
    done();
  });
  it('testModel serverName set', done => {
    testModel.serverPort = '7099';
    expect(testModel.serverAddress).toBe('127.0.0.1:7099');
    done();
  });
});

describe('reducer test', () => {
  it('owner reducers = {}', () => {
    const ReducerTester = session.ReducerModel;
    const action = {
      type: 'test/newItem',
      payload: '123'
    };
    const modelClass = {
      create: jest.fn(),
      modelName: 'test'
    };
    expect(ReducerTester.reducer(action, modelClass, {})).toEqual(undefined);
    expect(modelClass.create).toHaveBeenCalled();
    expect(modelClass.create.mock.calls[0][0]).toEqual(action.payload);
  });

  it('change recuerJson ', () => {
    const ReducerChangeTester = session.ReducerChangeModel;
    const modelClass = {
      modelName: 'change',
      abc: jest.fn(),
      efg: jest.fn()
    };
    const action1 = {
      type: 'change/newItem',
      payload: [1, 2, 3]
    };
    const action2 = {
      type: 'change/testReducer',
      payload: 123
    };
    const sessionState = {
      state: 123
    };
    expect(
      ReducerChangeTester.reducer(action1, modelClass, sessionState)
    ).toEqual(sessionState.state);
    expect(modelClass.abc).toHaveBeenCalled();
    expect(modelClass.abc.mock.calls[0][0]).toEqual(action1);
    expect(ReducerChangeTester.reducer(action2, modelClass, {})).toEqual(
      undefined
    );
    expect(modelClass.efg).toHaveBeenCalled();
    expect(modelClass.efg.mock.calls[0][0]).toEqual(action2);
  });
});
