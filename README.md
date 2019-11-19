cssciiweb 公共组件

### scripts

- `yarn build`;
- `yarn build:dist` 生产 dist 版本
- `yarn build:gulp` 生产 es|lib 版本 nvm

### npm 更新版本和发布

1、使用 npm version 更新版本号

`npm version [<newversion> | major | minor | patch`

2、Run npm publish.


### 开发规范

1. 组件文件夹统一用小写获取-连接符
2. 样式同意写在 style 文件夹中
3. 组件文件结构
```
aside-panel (组件名称)
|   |-- index.js (组件入口文件)
|   |-- style   ( babel-plugin-import 默认会添加 style 引用，必须要有)
|       |-- index.js
|       |-- index.less

```
4. 在 `components/index.js` 中 `export` 出来，名称首字母大写

```js 
export { default as AsidePanel } from './aside-panel';
```