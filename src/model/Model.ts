import 'reflect-metadata';

function isPropertyHasMethod(targetClass: any, prop: string) {
  let fieldName = '';
  const propList = Object.getOwnPropertyNames(targetClass).filter(it => {
    if (
      String(it)
        .toLowerCase()
        .indexOf(String(prop).toLowerCase()) === 3
    ) {
      fieldName = it;
      return true;
    } else {
      return false;
    }
  });
  return propList.length > 0 ? fieldName : undefined;
}

export function ProxyModel(
  target: any,
  originTarget: any,
  targetClass: any
): any {
  return new Proxy(target, {
    set: function(obj, prop, value) {
      // console.log('in set', Reflect.hasMetadata(prop, originTarget));
      if (Reflect.hasMetadata(prop, originTarget)) {
        obj._fields[prop] = value;
        return true;
      }
      //@ts-ignore
      obj[prop] = value;
      return true;
    },
    get: function(obj, prop) {
      const fieldName = isPropertyHasMethod(
        targetClass.prototype,
        String(prop)
      );
      if (fieldName !== undefined) {
        const {get} =
          Object.getOwnPropertyDescriptor(targetClass.prototype, fieldName) ||
          {};
        return get && get.call(obj);
      }
      if (Reflect.hasMetadata(prop, originTarget)) {
        return obj._fields[Reflect.getMetadata(prop, originTarget).fieldName];
      }
      //@ts-ignore
      return obj._fields[prop];
    }
  });
}
