# hjt-docs

这是一个简易的组件文档生成工具，可以通过代码注释的方式，快速生成组件文档。

## 开始使用

### 1.进入项目目录

```shell
$>  cd workspace
```

### 2.克隆项目

```shell
$>  npm install hjt-docs --save-dev
```

### 3.添加配置文件

```shell
$>  touch hjtDocs.config.js
```

### 4.添加内容

```js
module.exports = {
		inputDir: [
				'./components' // 需要生成文档的组件目录
    ],
  	outDir: './docs' // 文档输出的目录
};
```

### 5.生成文档

在项目根目录下执行

```shell
$> docs
```

\# 建议不要直接使用 cnpm 安装以来，会有各种诡异的 bug。可以通过如下操作解决 npm 下载速度慢的问题

npm install --registry=https://registry.npm.taobao.org

## 参考

+ [vuese-parser](https://vuese.org/#vuese-parser)

+ [vuese-markdown-render](https://vuese.org/#vuese-markdown-render)
+ [fs-extra](https://github.com/jprichardson/node-fs-extra)