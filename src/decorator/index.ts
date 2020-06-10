/**
 * 自动保存请求参数对象
 */
export const param = () => {
  return function(
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    var fn = descriptor.value;
    descriptor.value = async function(...args: any[]) {
      // @ts-ignore
      let type = `${this.__proto__.constructor.name}/${propertyKey}`;
      let payload = {
        type: type,
        payload: Object.assign({}, ...args)
      };

      //@ts-ignore
      if (this.__proto__[propertyKey]) {
        //@ts-ignore
        this.__proto__[propertyKey].toString = () => type;
      }
      //@ts-ignore
      this.middleware?.fetchParams(payload);

      await fn.apply(this, args);
    };
  };
};

/**
 * 自动保存请求状态变化
 * 请求开始 -> 请求结束
 */
export const loading = () => {
  return function(
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    var fn = descriptor.value;
    descriptor.value = async function(...args: any[]) {
      //@ts-ignore
      let type = `${this.__proto__.constructor.name}/${propertyKey}`;
      let reqPayload = {
        type: type,
        payload: true
      };
      let resPayload = {
        type: type,
        payload: false
      };

      // @ts-ignore
      if (this.__proto__[propertyKey]) {
        //@ts-ignore
        this.__proto__[propertyKey].toString = () => type;
      }

      // @ts-ignore
      const {fetchReq, fetchRes} = this.middleware;

      fetchReq(reqPayload);
      await fn.apply(this, args);
      fetchRes(resPayload);
    };
  };
};
