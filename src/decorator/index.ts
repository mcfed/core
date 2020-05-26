export const param = () => {
  return function(
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    var fn = descriptor.value;
    descriptor.value = function(...args: any[]) {
      args = args.map(value => {
        let payload = {
          type: `${target.constructor.name}/${propertyKey}`,
          payload: value
        };

        //@ts-ignore
        this.middleware.fetchParams(payload);
      });
      fn.apply(this, args);
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
      let type = `${target.constructor.name}/${propertyKey}`;
      let reqPayload = {
        type: type,
        payload: true
      };
      let resPayload = {
        type: type,
        payload: false
      };

      // @ts-ignore
      const {fetchReq, fetchRes} = this.middleware;

      fetchReq(reqPayload);
      if (fn.constructor.name === 'AsyncFunction') {
        await fn.bind(this)();
      }
      fetchRes(resPayload);
      fn.apply(this, args);
    };
  };
};
