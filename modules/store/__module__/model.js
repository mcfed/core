import {ModuleModel} from 'mcf-module';

const {attr, BaseModel} = ModuleModel;
export const namespace = 'user';

export default class user extends BaseModel {
  static modelName = namespace;
  static fields = {};
  static options = {
    // idAttribute: 'serverId',
  };
  static reducer() {}
}

Object.assign(user.fields, BaseModel.fields, {
  id: attr(),
  name: attr(),
  realName: attr(),
  mobilePhone: attr(),
  email: attr(),
  roles: attr(),
  role: attr(),
  createTime: attr(),
  status: attr(),
  roleId: attr()
});
