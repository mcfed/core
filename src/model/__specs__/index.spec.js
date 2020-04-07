import {fk, many, oneToOne} from 'redux-orm';
import {orm, createReducer} from '../index.ts';
import BaseModel from '../BaseModel.ts';
import {attr} from '../Attr.ts';

describe('ORM initial', () => {
  class TestModel extends BaseModel {
    static modelName = 'TestModel';
    static fields = {};
  }

  Object.assign(TestModel.fields, BaseModel.fields, {
    id: attr(),
    serverName: attr({
      getDefault: () => 'unname'
    }),
    serverStatus: attr(),
    serverIp: attr({
      get: function(val) {
        return 'http://' + val;
      }
    }),
    serverPort: attr({
      set: function(val) {
        this._fields['serverPort'] = val;
      }
    }),
    serverAddress: attr({
      get: function(val, row) {
        return [row.serverIp, row.serverPort].join(':');
      }
    }),
    port: attr('serverPort'),
    serverStatusStr: attr({
      fieldName: 'serverStatus',
      get: function(val) {
        return val === '1' ? '启用' : '禁用';
      }
    }),
    url: attr({
      getDefault: function() {
        return '8080';
      }
    })
    // columns: many('TestPropModel', 'tableId')
  });
  class TestPropModel extends BaseModel {
    static modelName = 'TestPropModel';
    static fields = {};
    getId() {
      return '';
    }
  }
  Object.assign(TestPropModel.fields, BaseModel.fields, {
    id: attr(),
    // tableId:attr(),
    // testModels:attr(),
    props2: attr(),
    props1: attr()
  });
  orm.register(TestModel, TestPropModel);
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
    }
  });
  const Test = session.TestModel;
  const TestProp = session.TestModel;
  var testModel = Test.create({
    id: 'abc',
    // serverName:"abd",
    serverStatus: '1',
    serverIp: '127.0.0.1',
    serverPort: '8080',
    ip: 'address'
  });

  // it.only('orm itemSelect',()=>{
  //   console.log(orm)
  //   console.log(Test.all().toModelArray())
  // })

  it('testModel constructor', done => {
    // console.log(Test)
    const obj = {
      id: 'aaa',
      serverName: 'abd',
      serverStatus: '2',
      serverIp: 'localhost',
      serverPort: '8888',
      ip: 'address'
    };
    expect(Test.parse(obj).toData()).toEqual({...obj, url: '8080'});
    expect(Test.idExists('aaa')).toEqual(false);
    //console.log(Test.all().toModelArray())
    // expect(testModel.serverName).toBe("abd")
    done();
  });

  it('testModel serverStatusStr', done => {
    expect(testModel.serverStatusStr).toBe('启用');
    done();
  });

  it('testModel  serverName default {unname}', done => {
    expect(testModel.serverName).toBe('unname');
    done();
  });

  it('testModel serverIp has value ', done => {
    // console.log(testModel.serverIp)
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
    testModel.serverName = 'abc';
    let t1 = Test.all().toModelArray()[0];
    // console.log(t1['serverAddress'])
    expect(t1.serverAddress).toBe('127.0.0.1:8080');
    done();
  });

  it('testModel update column', done => {
    let t1 = Test.withId('abc');

    t1.update({
      id: 'abc',
      serverName: '变大了'
    });
    done();
    // console.log(t1.toData())
  });

  it('testModel fk', done => {
    let t1 = Test.withId('abc');
    let t2 = TestProp.create({
      id: 1,
      tableId: 'abc',
      props1: 'aa',
      props2: 'bb'
    });

    // t1.abcd="abc"
    // expect(t1.abcd).toBe(null)

    done();
  });

  it('newItem', () => {
    expect(
      TestModel.reducer({type: 'TestModel/newItem', payload: {}}, Test, session)
    ).toEqual(session.state);
  });

  it('savePage', () => {
    expect(
      TestModel.reducer(
        {type: 'TestModel/savePage', payload: {items: [{id: 'abed'}]}},
        Test,
        session
      )
    ).toEqual(session.state);
  });

  it('saveList', () => {
    expect(
      TestModel.reducer(
        {type: 'TestModel/saveList', payload: {items: [{id: 'aa'}]}},
        Test,
        session
      )
    ).toEqual(session.state);
  });

  it('saveItem', () => {
    expect(
      TestModel.reducer(
        {type: 'TestModel/saveItem', payload: {}},
        Test,
        session
      )
    ).toEqual(session.state);
  });

  it('updateItem', () => {
    expect(
      TestModel.reducer(
        {type: 'TestModel/updateItem', payload: {id: 'abc'}},
        Test,
        session
      )
    ).toEqual(session.state);
  });

  it('deleteItem', () => {
    expect(
      TestModel.reducer(
        {type: 'TestModel/deleteItem', payload: 'abc'},
        Test,
        session
      )
    ).toEqual(session.state);
  });
});
describe('SqlWhiteListSetting', () => {
  class SqlWhiteListSetting extends BaseModel {
    static modelName = 'SqlWhiteListSetting';
    static fields = {};
    static reducer(state, action, model, session) {
      switch (action.type) {
        case 'CREATE_BOOK':
          Book.create(action.payload);
          break;
        case 'UPDATE_BOOK':
          Book.withId(action.payload.id).update(action.payload);
          break;
        case 'REMOVE_BOOK':
          const book = Book.withId(action.payload);
          book.delete();
          break;
        case 'ADD_AUTHOR_TO_BOOK':
          Book.withId(action.payload.bookId).authors.add(action.payload.author);
          break;
        case 'REMOVE_AUTHOR_FROM_BOOK':
          Book.withId(action.payload.bookId).authors.remove(
            action.payload.authorId
          );
          break;
        case 'ASSIGN_PUBLISHER':
          Book.withId(action.payload.bookId).publisherId =
            action.payload.publisherId;
          break;
      }
      // Return value is ignored.
      return undefined;
    }
  }

  Object.assign(SqlWhiteListSetting.fields, BaseModel.fields, {
    id: attr(),
    access: attr(),
    applyScope: attr()
  });

  class SqlWhiteListAccess extends BaseModel {
    static modelName = 'SqlWhiteListAccess';
    static fields = {};
  }

  Object.assign(SqlWhiteListAccess.fields, BaseModel.fields, {
    id: attr(),
    action: attr(),
    audit: attr()
  });

  orm.register(SqlWhiteListSetting, SqlWhiteListAccess);

  let session = orm.session({
    SqlWhiteListSetting: {
      items: [],
      itemsById: {},
      meta: {}
    },
    SqlWhiteListAccess: {
      items: [],
      itemsById: {},
      meta: {}
    }
  });
  const WhiteListAccess = session.SqlWhiteListAccess;
  const WhiteListSetting = session.SqlWhiteListSetting;

  it('SqlWhiteListSetting create', done => {
    // console.log(WhiteListSetting)

    const data = {
      applyScope: 1,
      access: {
        action: 5,
        audit: 1,
        rate: 100,
        cycNum: 1,
        cyc: 's',
        riskLevel: 3,
        status: 0
      }
    };
    const setting = WhiteListSetting.create(data);
    setting.update({access: WhiteListAccess.create(data.access)});
    // console.log(setting)
    // setting.access.update({audit:2})
    // WhiteListAccess.withId(0).update({audit:3})
    // console.log(WhiteListAccess.withId(0))
    // console.log(setting)
    // console.log(WhiteListAccess.all().toModelArray())
    done();
  });
});
