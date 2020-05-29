import {param, loading} from '../index';

class A {
  middleware = {
    fetchParams: jest.fn(),
    fetchReq: jest.fn(),
    fetchRes: jest.fn()
  };

  @param()
  async fetchPage(params: any) {}

  @loading()
  async fetchList() {}
}

describe('decorator unit test', () => {
  it('param test', () => {
    const a = new A();
    a.fetchPage({name: 'param'});
    expect(a.middleware.fetchParams).toHaveBeenCalledTimes(1);
    expect(a.middleware.fetchParams).toHaveBeenCalledWith({
      payload: {name: 'param'},
      type: 'A/fetchPage'
    });
    expect(a.fetchPage.toString()).toBe('A/fetchPage');
  });
  it('loading test', async () => {
    const a = new A();
    const d = await a.fetchList();
    expect(a.middleware.fetchReq).toHaveBeenCalledTimes(1);
    expect(a.middleware.fetchReq).toHaveBeenCalledWith({
      payload: true,
      type: 'A/fetchList'
    });

    expect(a.middleware.fetchRes).toHaveBeenCalledTimes(1);
    expect(a.middleware.fetchRes).toHaveBeenCalledWith({
      payload: false,
      type: 'A/fetchList'
    });

    expect(a.fetchPage.toString()).toBe('A/fetchList');
  });
});
