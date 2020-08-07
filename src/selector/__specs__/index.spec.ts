import * as Selector from '../index';
import {attr, BaseModel, orm, pk} from '../../model';
import {createSelector} from 'reselect';

let fetchingMap = new Map();
fetchingMap.set('f', true);

let querysMap = new Map();
querysMap.set('q', {
  a: 1,
  b: 2
});

class TestModel extends BaseModel {
  static modelName = 'TestModel';
  @pk()
  id!: string;
}
//@ts-ignore
orm.register(TestModel);

//@ts-ignore
const emptyDBstate = orm.getEmptyState();
//@ts-ignore
let session = orm.session(...emptyDBstate);

const dicts = {
  a: [
    {
      label: 'a',
      value: 1
    },
    {
      label: 'b',
      value: 2
    }
  ]
};

let dictsMap = new Map();
dictsMap.set('a', true);

const state = {
  fetchingReducer: {
    fetching: fetchingMap,
    params: querysMap
  },
  ORMReducer: session.state,
  appReducer: {
    dicts: dicts
  },
  TestModel: {}
};

describe('selector unit case', () => {
  it('spinsSelector', function() {
    expect(Selector.spinsSelector(state)).toEqual(
      state.fetchingReducer.fetching
    );
  });

  it('querysSelector', function() {
    expect(Selector.querysSelector(state)).toEqual(
      state.fetchingReducer.params
    );
  });

  it('dictsSelector', function() {
    expect(Selector.dictsSelector(state)).toEqual(state.appReducer.dicts);
  });

  it('spins', function() {
    expect(Selector.spins(state, 'f')).toEqual(fetchingMap.get('f'));
  });
  it('query', function() {
    expect(Selector.querys(state, 'q')).toEqual(querysMap.get('q'));
  });

  it('query', function() {
    expect(Selector.querys(state, 'p')).toEqual({});
  });

  it('dicts', function() {
    expect(Selector.dicts(state, 'a')).toEqual(dicts.a);
  });

  it('dicts with type exist', function() {
    expect(Selector.dicts(state, 'a', 1)).toBe('a');
  });

  it('dicts with type exist', function() {
    expect(Selector.dicts(state)).toEqual(dicts);
  });

  it('dicts type value', function() {
    expect(Selector.dicts(state, 'a', 1)).toEqual('a');
  });
});
describe('reselector unit case', () => {
  it('reselect containerSelector', function() {
    const resultState = Selector.containerSelector('TestModel', {})(state);
    //@ts-ignore
    expect(resultState).toHaveProperty('item', {_fields: {}});
    expect(resultState).toHaveProperty('items', []);
  });

  it('reselect containerSelector with props', function() {
    const resultState = Selector.containerSelector('TestModel', {
      match: {params: {id: 1}}
    })(state);
    expect(resultState).toHaveProperty('item', {_fields: {}});
    expect(resultState).toHaveProperty('items', []);
  });

  it('reducerSelector reducerModel', () => {
    expect(Selector.reducerModel(state, 'TestModel'));
  });

  it('reducerSelector reducerItemSelector', () => {
    expect(Selector.reducerItemSelector(state, 'TestModel', '1')).toEqual({
      _fields: {}
    });
  });

  it('reducerSelector reducerItemSelector with props', () => {
    expect(Selector.reducerItemSelector(state, 'TestModel', '1')).toEqual({
      _fields: {}
    });
  });

  it('reducerSelector reducerPageSelector', () => {
    expect(Selector.reducerPageSelector(state, 'TestModel')).toEqual([]);
  });

  it('reducerSelector reducerPageSelector with filterCB', () => {
    expect(
      Selector.reducerPageSelector(state, 'TestModel', () => true)
    ).toEqual([]);
  });

  it('reducerSelector reducerListSelector', () => {
    expect(Selector.reducerListSelector(state, 'TestModel')).toEqual([]);
  });

  it('reducerSelector reducerListSelector with filterCB', () => {
    expect(Selector.reducerListSelector(state, 'TestModel', () => true));
  });
});
