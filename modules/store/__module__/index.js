import router from './router';
import saga from './saga';
import reducer from './reducer';
import * as model from './model';

export {saga, reducer, router, model};
export default () => router;
