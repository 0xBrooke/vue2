# 对接小美帮客App

### 安装
```
yarn install
 或
yarn add [package]@[version] [-D]
```

### 启动本地服务
```
yarn run serve
```

### dll编译,在构建项目之前,先运行一次该命令.项目中大量复用模块的dll只需要编译一次，在之后的构建过程中被dll包含的模块将不会在重新编译，而是直接使用dll中的代码。
```
yarn run dll:dev
```

### 测试打包
```
yarn run build:test
```

### 生产打包
```
yarn run build
```

### 检查并修复源文件
```
yarn run lint
```

### 把某些目录或文件加入忽略规则，只修改.gitignore是无效的，原因是.gitignore只能忽略那些原来没有被追踪的文件，如果某些文件已经被纳入了版本管理中，则修改.gitignore是无效的。那么解决方法就是先把本地缓存删除（改变成未被追踪状态），然后再提交：
git rm -r --cached .
git add .
git commit -m 'update .gitignore'


### ESlint + Prettier + husky

    使用 editorconfig 协助兼容开发工具的代码格式化。
    使用 eslint 检查代码。
    使用 prettier 格式化代码。（可以理解为prettier是 eslint —fix 的加强版，用 prettier 来代替 eslint-fix）
    手动修改剩下的有问题的地方，或者有些地方很难用规则来判断的时候，就需要手动修改。


1.保存自动检测和格式化
    编辑器配置 .vscode/settings.json:
```
{
    "editor.snippetSuggestions": "top",
    "editor.formatOnPaste": true,
    //保存时eslint自动修复错误
    "eslint.autoFixOnSave": true,
    //保存自动格式化
    "editor.formatOnSave": true
}

```


2.手动执行命令进行检测和格式化
    npm run lint    --> exlint --fix 会被触发
    npm run prettier


3.提交前进行检测和格式化
    git add .
    git commit    --> git commit时触发 husky hook 代码检测


### 发布计划参考：http://project.gmfcloud.com/T44514
    发布计划中系统名称为：smbk-h5

    http://myfen-ts.gomeuat.com.cn/smc-dev32


    测试环境地址：http://myfen-ts.gomeuat.com.cn/smbk-h5-sit1/login
    正式环境地址：https://myfen.gome.com.cn/smbk-h5/login