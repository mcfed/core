import {MiddlewareFactory} from '../';
import {useActionProxy} from '../../proxy/';
describe('test Middleware', () => {
  xit('fetchReq', () => {
    const dispatch = function(action: any) {
      return action;
    };
    //@ts-ignore
    const Midd = useActionProxy(MiddlewareFactory, dispatch, '@@MIDDLEWARE');
    //@ts-ignore
    console.log(Midd.fetchParams({a: 1}));

    // expect(Midd.fetchParams({a: 1})).toEqual({
    //   type: '@@MIDDLEWARE/fetchParams',
    //   payload: { a: 1 },
    //   meta: { method: 'fetchParams'}
    // });
  });
});
