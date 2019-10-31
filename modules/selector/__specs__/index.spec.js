import * as Selector from '../index';
import {createSelector} from 'reselect'

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
    expect(Selector.spins(state,'f')).toEqual(fetchingMap.get('f'));
  });
  it('query', function() {
    expect(Selector.querys(state,'q')).toEqual(querysMap.get('q'));
  });

  it('dicts', function() {
    expect(Selector.dicts(state,'a')).toEqual(dicts.a);
  });

  it('dicts type value', function() {
    expect(Selector.dicts(state,'a', 1)).toEqual('a');
  });
})
describe('reselector unit case', () => {
  it('reselect containerStructuredSelector',()=>{
    expect(Selector.containerStructuredSelector(state)).toHaveProperty('dicts')
    expect(Selector.containerStructuredSelector(state)).toHaveProperty('querys')
    expect(Selector.containerStructuredSelector(state)).toHaveProperty('spins')
  })

  xit('reselect crudStructuredSelector',function(){
    console.log(Selector.crudStructuredSelector(state,"",{}))

  })
});
