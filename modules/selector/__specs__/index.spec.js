import * as Selector from '../index';

let fetchingMap = new Map();
fetchingMap.set('f', true);

let querysMap = new Map();
querysMap.set('q', {
  a: 1,
  b: 2
});

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
  appSelector: {
    dicts: dicts
  }
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
    expect(Selector.dictsSelector(state)).toEqual(state.appSelector.dicts);
  });

  it('spins', function() {
    expect(Selector.spins('f')(state)).toEqual(fetchingMap.get('f'));
  });
  it('query', function() {
    expect(Selector.querys('q')(state)).toEqual(querysMap.get('q'));
  });

  it('dicts', function() {
    expect(Selector.dicts('a')(state)).toEqual(dicts.a);
  });

  it('dicts type value', function() {
    expect(Selector.dicts('a', 1)(state)).toEqual('a');
  });
});
