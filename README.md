[![pipeline status](http://git.mchz.com.cn/mcf/core/badges/master/pipeline.svg)](http://git.mchz.com.cn/mcf/core/commits/master)
[![coverage report](http://git.mchz.com.cn/mcf/core/badges/master/coverage.svg)](http://git.mchz.com.cn/mcf/core/commits/master)

# core

[![pipeline status](http://git.mchz.com.cn/mcf/core/badges/master/pipeline.svg)](http://git.mchz.com.cn/mcf/core/commits/master)
[![coverage report](http://git.mchz.com.cn/mcf/core/badges/master/coverage.svg)](http://git.mchz.com.cn/mcf/core/commits/master)

> 使用方式请查看各有组件 readme.md 文件

#useage
当前版本已发布 npm 仓库（私有仓库）

- 添加.npmrc 文件
  `registry=http://192.168.200.178:4873/`
- 运行命令安装包
  `npm install mcf-core`

## develop 规范要求

- `创建新功能`分支来源 `master` 统一采用 `feature/组件英文名称` 上进行代码开发，开发完成后提交 `merge_request` ,合并成功后`owner`将删除当前分支
- `修改BUG` 分支来源 `master` 统一采用 `hotfix/已有组件英文名称` 上进行代码开发，开发完成后提交 `merge_request` 合并成功后`owner`将删除当前分支
- `master` 与 `develop` 不允许直接提交，统一采用 branch 开发后，提交`merge_request` 到 `develop` 请求合并代码审核。
- CI 单元测试能过后才能提交代码合并请求，未通过一概不允许合并
- 合并请求时请 清楚描述 修改内容 `add : 新增XXX组件`
- 合并请求描述规范格式要求：`ADD:新增XXX组件`、`MODIFY:XXX组件增加单元测试`、`BUGFIXED:修改 XXX 组件 YYY bug`

- 合并 master 规范：`master`禁止提交代码，只允许来源`develop`内容

- 合并 发布版本内容 在`develop`分支工作
  - 修改 changelogs.md 文件 将发布描述版本内容
  - 修改 version 号 配置，防止合并到 `master` 后发起发布失败(已发布版本号不允许二次发布)
  - 合并将要发布的版本内容合并
  - 提交 `meger_request` 到 `master` 在`master`合并 CI 自动发版成功
