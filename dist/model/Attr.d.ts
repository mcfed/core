import {Attribute, CreateProps} from 'redux-orm';
export default class Attr extends Attribute {
  private fieldName?;
  private opts?;
  private getDefault?;
  private getMethod?;
  private setMethod?;
  constructor(opts?: CreateProps<any>);
  createForwardsDescriptor(fieldName: String, model: any): any;
}
declare function attr(opt: any): Attr;
export {attr};
