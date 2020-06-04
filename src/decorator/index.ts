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
      args.map(value => {
        let payload = {
          type: type,
          payload: value
        };

        //@ts-ignore
        this.__proto__[propertyKey].toString = () => type;

        //@ts-ignore
        this.middleware.fetchParams(payload);
      });
      await fn.apply(this, args);
    };
  };
};

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
      //@ts-ignore
      this.__proto__[propertyKey].toString = () => type;

      // @ts-ignore
      const {fetchReq, fetchRes} = this.middleware;

      fetchReq(reqPayload);
      await fn.apply(this, args);
      fetchRes(resPayload);
    };
  };
};
