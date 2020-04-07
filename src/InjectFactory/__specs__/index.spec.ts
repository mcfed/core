import {Injectable, Factory} from '../index';

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
