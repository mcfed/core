import {fk, many, oneToOne} from 'redux-orm';
import {orm, createReducer} from '../index.ts';
import BaseModel from '../BaseModel.ts';
import {attr} from '../Attr.ts';

export const namespace = 'WhiteNameSet';

let whiteNames = [
  {
    name: 'appName',
    id: 1,
    ips: [
      {
        id: 1,
        ipMode: 1
      },
      {
        id: 3,
        ipMode: 2
      }
    ]
  },
  {
    name: 'oracle',
    id: 2,
    ips: [
      {
        id: 2,
        ipMode: 2
      }
    ]
  }
];

class WhiteNameSet extends BaseModel {
  static modelName = namespace;
  static fields = {};
  static options = {
    // idAttribute: 'id',
  };
  // static customCreate(data){
  //   const {ips,...other} = data
  //   const model = WNSet.create(other)
  //   ips.map(i => WNIPSet.create({ ...i, whiteId:model.id}))
  //   return model
  // }

  // static reducer = function (action,modelClass, session) {
  //   const modelName = modelClass.modelName;
  //   switch (action.type) {
  //     case `${modelName}/newItem`:
  //       const {ips,...other} = action.payload
  //       const m= modelClass.create(other)
  //       ips.map(i => session['WhiteNameIPSet'].create({ ...i, whiteId:m.id}))
  //       break;

  //     case `${modelName}/savePage`:
  //       modelClass
  //         .all()
  //         .toModelArray()
  //         .forEach((model) => model.delete());
  //       action.payload.items.map((m) => modelClass.create(m));
  //       break;
  //     case `${modelName}/saveList`:
  //       action.payload.items.map((m) => modelClass.create(m));
  //       break;
  //     case `${modelName}/updateItem`:
  //       modelClass.upsert(action.payload);
  //       break;
  //     case `${modelName}/saveItem`:
  //       modelClass.upsert(action.payload);
  //       break;
  //     case `${modelName}/deleteItem`:
  //       const model = modelClass.withId(action.payload);
  //       model.delete();
  //       break;
  //     default:
  //     //  console.log(modelClass,action.type)
  //   }
  //   return session.state;
  // }
}

Object.assign(WhiteNameSet.fields, BaseModel.fields, {
  appName: attr()
});

class WhiteNameIPSet extends BaseModel {
  static modelName = 'WhiteNameIPSet';
  static fields = {};
  static options = {
    idAttribute: 'id'
  };
}

Object.assign(WhiteNameIPSet.fields, BaseModel.fields, {
  whiteId: fk({to: 'WhiteNameSet', relatedName: 'ips'}),
  ipMode: attr(),
  note: attr(),
  ipCombine: attr({
    get: function(val, row) {
      if (row.ipMode === 0 || row.ipMode === 1) {
        return row.ip;
      } else return [row.ip, '-', row.ipEnd];
    }
  })
});

orm.register(WhiteNameSet, WhiteNameIPSet);
let session = orm.session({
  WhiteNameSet: {
    items: [],
    itemsById: {},
    meta: {}
  },
  WhiteNameIPSet: {
    items: [],
    itemsById: {},
    meta: {}
  }
});

const WNSet = session.WhiteNameSet;
const WNIPSet = session.WhiteNameIPSet;

describe('ORM initial', () => {
  it('wnset', () => {
    let whiteNames = [
      {
        name: 'appName',
        id: 1
      },
      {
        name: 'oracle',
        id: 2
      }
    ];

    let whiteIPMaps = [
      {
        id: 1,
        ipMode: 1,
        whiteId: 1
      },
      {
        id: 2,
        ipMode: 2,
        whiteId: 2
      },
      {
        id: 3,
        ipMode: 2,
        whiteId: 1
      }
    ];
    whiteNames.map(w => {
      WNSet.create(w);
    });
    whiteIPMaps.map(ip => {
      WNIPSet.create(ip);
    });
    expect(WNSet.withId(1).ips.count()).toBe(2);
    WNIPSet.withId(1).update({note: 'ip1'});
    console.log(WNSet.withId(1).ips.toModelArray());
    WNIPSet.withId(2).delete();
    expect(WNSet.withId(1).ips.count()).toBe(WNIPSet.count());
    console.log(WNSet.withId(1).ips.count());
  });

  xit('WNSet  static method customCreate', () => {
    whiteNames.map(wn => WhiteNameSet.customCreate(wn));
    console.log(WNSet.all().toModelArray());
    console.log(WNIPSet.all().toModelArray());
  });

  xit('method reducer', () => {
    let action = {
      type: 'WhiteNameSet/newItem',
      payload: whiteNames[0]
    };
    WNSet.reducer(action, WNSet, session);
    console.log(WNSet.withId(1).ips);
  });
});
