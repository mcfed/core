//@ts-ignore
import {session} from './ormInit';

describe('ORM initial', () => {
  var TestModelInstance = session.TestModel.create({
    id: 'abc',
    // serverName: 'abd',
    serverStatus: '1',
    serverIp: '127.0.0.1',
    serverPort: '8080',
    serverAddress: 'test',
    ip: 'address'
  });

  it('field use', () => {
    expect(TestModelInstance.id).toEqual('abc');
    expect(TestModelInstance.serverStatus).toEqual('启用');
    expect(TestModelInstance.serverIp).toEqual('http://127.0.0.1');
    expect(TestModelInstance.serverPort).toEqual('8080');
    expect(TestModelInstance.ip).toEqual(undefined);
    expect(
      session.TestModel.all()
        .toModelArray()
        .pop().id
    ).toEqual('abc');
    expect(
      session.TestModel.all()
        .toModelArray()
        .pop().serverStatus
    ).toEqual('启用');
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
