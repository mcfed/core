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
  role: attr({
    fieldName: 'roles',
    get: function(val) {
      return val && val[0];
    }
  }),
  createTime: attr(),
  status: attr(),
  roleId: attr({
    fieldName: 'roles',
    get: function(val) {
      return val && val.map(v => v.id)[0];
    }
  })
});
