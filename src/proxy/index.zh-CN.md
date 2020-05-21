## 何时使用

需要使用 Redux 时，可以采用`OOP`的设计实现`Reducer`类并以更简洁的语法进行调用

## API

### reduxActionProxy

用于封装 Redux 的`Reducer`，通过 Proxy 拦截传入的`OOP`设计的 Reducer 实例，使得 Reducer 可以摆脱`case`分支的`plain function`写法，以 OOP 的形式编写，并以对象方法的形式定义`action`的局部行为

#### Example

```ts
import {createStore, applyMiddleware, Reducer} from 'redux';
class CarReducer {
  static initialState = {a: 1, b: 2};

  getReducer(): Reducer {
    return (state: object) => state;
  }

  inital(payload: any) {
    return payload;
  }
}
const reducers = reduxActionProxy(new CarReducer());
const store = createStore(
  reducers.getReducer(), // getReducer被Proxy识别并返回redux可接受的特殊函数
  CarReducer.initialState,
  applyMiddleware()
);
console.log(store.getState()); // {a: 1, b: 2}
console.log(reducers.inital({c: 1})); // {c: 1}
store.dispatch({
  type: 'CarReducer/inital', // 这里不再重要！
  payload: {c: 1},
  meta: {method: 'inital'} // 现在根据它来识别
});
console.log(store.getState()); // {a: 1, b: 2, c: 1}
```

### useActionProxy

用于封装 Redux 的`Action`，通过 Proxy 拦截传入的 OOP 设计的 Reducer 实例，使得 Reducer 可以不需要通过显式的`dispatch`来触发

### Example

```ts
import {createStore, applyMiddleware, Reducer} from 'redux';
class CarReducer {
  static initialState = {a: 1, b: 2};

  getReducer() {
    const self = this;
    return function(state: any, action: any) {
      switch (
        action.meta?.method // 根据proxy触发dispatch时传入的参数识别case
      ) {
        case 'inital':
          return {
            ...state,
            ...self.inital(action.payload, state) // 调用源对象的方法并返回局部行为的结果
          };
        default:
          return state;
      }
    };
  }

  inital(payload: any, state?: any) {
    return payload;
  }
}
const store = createStore(
  new CarReducer().getReducer(),
  CarReducer.initialState,
  applyMiddleware()
);
console.log(store.getState()); // {a: 1, b: 2}
const reducerAction = useActionProxy(new CarReducer(), store.dispatch);
reducerAction.inital({c: 1}); // 将会被拦截并触发一次dispatch
console.log(store.getState()); // {a: 1, b:2, c:1}
```
