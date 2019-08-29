import {Attribute} from 'redux-orm';

export default class Attr extends Attribute {
  private fieldName?: string;
  private opts?: AttributeOpts;
  private getDefault?: Function;
  private getMethod?: Function;
  private setMethod?: Function;
  constructor(opts?: AttributeOpts) {
    super(opts);

    if (opts && typeof opts === 'string') {
      this.fieldName = opts;
    }
    if (opts && opts.hasOwnProperty('getDefault')) {
      this.getDefault = opts.getDefault;
    }
    if (opts && opts.hasOwnProperty('fieldName')) {
      this.fieldName = opts.fieldName;
    }
    if (opts && opts.hasOwnProperty('get')) {
      this.getMethod = opts.get;
    }
    if (opts && opts.hasOwnProperty('set')) {
      this.setMethod = opts.set;
    }
  }

  createForwardsDescriptor(fieldName: String, model: any): any {
    const getMethod = this.getMethod;
    const setMethod = this.setMethod;
    const mapperFieldName = this.fieldName || fieldName;
    return {
      get() {
        // console.log(mapperFieldName,getMethod)
        //@ts-ignore
        return getMethod
          ? getMethod.call(this, this._fields[mapperFieldName], this._fields)
          : this._fields[mapperFieldName];
      },
      set(value: any) {
        // console.log(mapperFieldName,setMethod)
        return setMethod
          ? setMethod.call(this, this.set(mapperFieldName, value))
          : this.set(mapperFieldName || fieldName, value);
      },
      enumerable: true,
      configurable: true
    };
  }
}

function attr(opt: AttributeOpts) {
  return new Attr(opt);
}

export {attr};
