// // @ts-nocheck
// import {attr, BaseModel} from '../../model';

// export const namespace = 'user';

// export default class user extends BaseModel {
//   static modelName = namespace;
//   static fields = {};
//   static options = {
//     // idAttribute: 'serverId',
//   };
//   static reducer() {}
// }

// Object.assign(user.fields, BaseModel.fields, {
//   id: attr(),
//   name: attr(),
//   realName: attr(),
//   mobilePhone: attr(),
//   email: attr(),
//   roles: attr(),
//   role: attr(),
//   createTime: attr(),
//   status: attr(),
//   roleId: attr()
// });

import {ModelORM, attr, BaseModel, pk} from '../../model';
//import { IModel } from "./interface";

//const { attr, BaseModel, pk } = ModelORM;

export const namespace = 'user';

export default class Abcd extends BaseModel {
  constructor(props: any) {
    super(props);
    this.initFields(props);
  }
  static modelName: string = namespace;

  @pk()
  id!: number;
  @attr()
  name!: string;
  @attr()
  title!: string;

  getName() {}
}
