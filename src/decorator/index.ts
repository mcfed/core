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
      args = args.map(value => {
        let payload = {
          type: type,
          payload: value
        };

        // @ts-ignore
        // fn.__proto__.toString = () => type;
        fn.constructor.prototype.toString = () => type;

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

      // @ts-ignore
      // fn.__proto__.toString = () => type;
      fn.constructor.prototype.toString = () => type;

      // @ts-ignore
      const {fetchReq, fetchRes} = this.middleware;

      fetchReq(reqPayload);
      // if (fn.constructor.name === 'AsyncFunction') {
      //   await fn.apply(this, args);
      // } else {
      //   fn.apply(this, args)
      // }
      await fn.apply(this, args);
      fetchRes(resPayload);
    };
  };
};
