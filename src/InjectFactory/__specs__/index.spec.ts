import {
  Injectable,
  Factory,
  ActionFactory,
  ActionMiddleWareFactory
} from '../index';
//import { Dispatch } from "redux";
import {createStore} from 'redux';
import createPassport, {
  fetchLogining,
  fetchLogouting
} from '../../middleware/redux-passport';

const reducer = (state = {count: 0}, action: any) => {
  switch (action.type) {
    case 'INCREASE':
      return {count: state.count + 1};
    case 'DECREASE':
      return {count: state.count - 1};
    default:
      return state;
  }
};
const store = createStore(reducer);

describe('Factory自动注入类方法', () => {
  it('自动注入一个类方法', () => {
    class Api {
      fetch() {
        console.log('fetch');
      }
    }
    @Injectable
    class Action {
      constructor(public api: Api) {}
      fetchAction() {
        this.api.fetch();
      }
    }
    const action = Factory(Action);
    expect(action.api).not.toBeUndefined();
    expect(action.api).toBeInstanceOf(Api);
  });

  it('自动注入多个类方法', () => {
    class Api {
      fetch() {
        console.log('fetch');
      }
    }
    class Ap2 {
      fetch2() {
        console.log('fetch ap2');
      }
    }
    @Injectable
    class Action {
      constructor(public api: Api, public ap2: Ap2) {}
      fetchAction() {
        this.api.fetch();
        this.ap2.fetch2();
      }
    }
    const action = Factory(Action);
    expect(action.api).not.toBeUndefined();
    expect(action.api).toBeInstanceOf(Api);
    expect(action.ap2).not.toBeUndefined();
    expect(action.ap2).toBeInstanceOf(Ap2);
  });

  it('自动注入一个类,注入类又注入其他类', () => {
    class Ap2 {
      fetch2() {
        console.log('fetch ap2');
      }
    }
    @Injectable
    class Api {
      constructor(public ap2: Ap2) {}
      fetch() {
        console.log('fetch');
      }
    }
    @Injectable
    class Action {
      constructor(public api: Api) {}
      fetchAction() {
        this.api.fetch();
        this.api.ap2.fetch2();
      }
    }
    const action = Factory(Action);
    expect(action.api).not.toBeUndefined();
    expect(action.api).toBeInstanceOf(Api);
    expect(action.api.ap2).not.toBeUndefined();
    expect(action.api.ap2).toBeInstanceOf(Ap2);
  });

  it('自动注入一个ActionFactory类方法', () => {
    class Api {
      fetch() {
        console.log('fetch');
      }
    }
    @Injectable
    class Action {
      constructor(public api: Api) {}
      fetchAction() {
        this.api.fetch();
      }
    }
    const action = ActionFactory(Action, store.dispatch, 'Abcd');
    expect(action.api).not.toBeUndefined();
    expect(action.api).toBeInstanceOf(Api);
  });
  it('自动注入一个ActionFactory2类方法', () => {
    class Api {
      fetch() {
        console.log('fetch');
      }
    }
    class Reducer {
      fetch2() {
        console.log('fetch2');
      }
    }
    class Middleware {
      fetch3() {
        console.log('fetch3');
      }
      createPassport() {}
    }
    @Injectable
    class Action {
      constructor(
        public readonly reducer: Reducer,
        public readonly api: Api,
        public readonly middlewares: Middleware
      ) {}
      fetchAction() {
        this.api.fetch();
      }
    }
    const action = ActionMiddleWareFactory(Action, store.dispatch, 'Abcde', {
      fetchLogining: () => store.dispatch(fetchLogining({})),
      fetchLogouting: () => store.dispatch(fetchLogouting({}))
    });
    //@ts-ignore
    //console.log(222,action.middlewares.fetchLogining(),action.middlewares)

    expect(action.api).not.toBeUndefined();
    expect(action.api).toBeInstanceOf(Api);
  });
});

describe('', () => {
  it('注入一个非类方法', () => {
    var NoClass = {
      a: 1
    };
    @Injectable
    class Action {
      //@ts-ignore
      constructor(public noClass: NoClass) {}
      fetchAction() {
        this.noClass;
      }
    }
    const action = Factory(Action);
    expect(action.noClass).toEqual({});
  });
});
