// @ts-nocheck
//用户个人信息更新(二期)
const mutation = `
mutation user{
   updateUser{
    ...user
  }
}`;

//告警设置 用户下拉框(二期)
const simpleQuery = `
query user{
  result: userSimple{
    ...user
  }
}`;
const RestResultQuerySimple = `
fragment user on RestResultSimple {
  code
  message
  data {
    ...userItem
  }
}`;
//告警设置 用户下拉框(二期) end

// const user = `fragment user on RestResultSimple {
//   code
//   message
//   data {
//     ...User
//   }
// }`
//
const query = `
query user{
  result: user{
    ...user
  }
}`;

const queryItem = `
query user{
  userItem{
    ...user
  }
}`;

const RestResultQuery = `
fragment user on RestResult {
  code
  message
  data {
    ...userList
  }
}`;
const RestResult = `
fragment user on RestResult {
  code
  message
}`;

const RestResultItem = `
fragment user on RestResultItem {
  code
  message
  data {
    ...userItem
  }
}`;

const ListResultQuery = `
fragment userList on ListResult {
  start
  end
  total
  items {
    ...userItem
  }
}`;

const FragmentItem = `
fragment userItem on UserItem {
  id
  name
  realName
  mobilePhone
  email
  status
  createTime
  roles{
    id
    name
  }
}`;

// const Variables = `
// input mutation{
//   realName: string,
//   mobilePhone: string,
//   email: string,
// }`

// const DemoVariables = {
//   "realName": "李四",
//   "mobilePhone": "13588888888",
//   "email": "koksbape@126.com"
// }
//
export const getFragmentList =
  query + RestResultQuery + ListResultQuery + FragmentItem;
export const getFragmentItem = queryItem + RestResultItem + FragmentItem;
export const getFragmentMutation = mutation + RestResult;
export const getFragmentSimple =
  simpleQuery + RestResultQuerySimple + FragmentItem;
