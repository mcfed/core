### Github Action 自动发布 npm 包

#### 1、如果要发布的包之前并没有在 npm 仓库中存在

我们通过 Github Action 进行包的自动发布，Action 会到 npm 仓库中查找该包是否存在，如果不存在则会发包失败。
> Tips: **所以初始发包要手动发布到** **npm** **仓库**

#### 2、如果发布的包在 npm 仓库中已存在

* 发布前确保代码提交至远程仓库
* 本地创建 tag
* 推送 tag 触发发布流程（Github Action 监听 tag 变更，触发 CI 发布流程）

发布流程触发机制：
```shell
name: npm-publish
on:
  push:
    tags:
    - '*' # Watch the tag version change
```

推送 tag 命令

```shell
# 推送单个 tag
git push origin [tagname]

# 推送所有 tag
git push [origin] --tags
```
