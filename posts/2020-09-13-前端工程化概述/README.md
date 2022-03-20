<h1>前端工程化概述</h1>


由于前端项目变得越来越复杂, 如何保证前端项目的多人协同的开发质量和开发效率, 成为越来越重要的问题. 将软件工程引入前端项目, 使前端工程化, 是解决问题的最好办法.

<!--more-->

## 前端工程化概述

*此部分参考了<https://www.zhihu.com/question/24558375>*

前端工程化应该从模块化, 组件化, 规范化和自动化四个方面来考虑.

1.  模块化

    模块化就是指在文件层面上对复杂的项目进行分割, 并将其合理组装起来的思想. 这是进行多人协作和功能划分的基本保证.
    - JavaScript的模块化. 在之前出现过AMD, CMD, 以及CommonJS等模块加载方案, 不过现在ES6已经在语言层面对模块系统进行了规定, 详见我的[部分ES6知识-Module](https://sien75.github.io/blog/2020/08/12/%E9%83%A8%E5%88%86ES6%E7%9F%A5%E8%AF%86/#Module)
    - CSS的模块化, 某个CSS文件引入其他的CSS文件可以使用Sass的`@import`, 而为了解决CSS的全局选择器的冲突, 可以采用CSS Modules

    目前的构建工具中, Webpack最为流行. Webpack不仅允许使用ES6的module方法引入JavaScript文件, 还可以通过各种Loader, 同样使用ES6的module方法引入TypeScript, CSS, Sass和静态资源.

2.  组件化

    组件化是在UI层面上对各部分进行拆分, 然后按需组合的思想. 组件之间也有继承, 包含等关系. 现在一般通过使用框架来进行组件化, 如Vue.

3.  规范化

    所谓规范化, 就是确定开发的标准, 包括目录结构的规定, 接口规范, git规范和UI视觉规范等.

4.  自动化

    自动化就是把简单重复的工作交给机器, 使人着眼于真正的问题, 而不是繁琐的步骤. 像Webpack就是一个自动化构建工具, 开发项目时无需关心如何使代码在浏览器上运行, 这个工作由Webpack完成了.

## Webpack

Webpack是一个自动化构建工具. 开发者使用了一套便于大型项目开发的体系, 但是这种体系是浏览器无法理解的, 这里面比如ES6, TypeScript, Sass, vue等, 这些浏览器无法理解的开发技术是为了更好地开发大型前端项目. Webpack就是担任这样一个角色: 把多个开发文件打包成浏览器可以理解的几个HTML, CSS, JavaScript和图片文件. 此外, Webpack还会自动地监听本地代码变化并重新构建, 并且做一些文件优化, 代码校验等.

这里附加一个使用Vue的项目的简单配置, 参考了<https://webpack.wuhaolin.cn/>:

webpack.config.js
```js
const path = require('path');

module.exports = {
  entry: './main.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, './dist'),
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        use: ['vue-loader'],
      },
    ]
  },
  devtool: 'source-map'
};
```

package.json
```json
"dependencies": {
    "vue": "^2.4.2"
},
"devDependencies": {
    "css-loader": "^0.28.5",
    "vue-loader": "^13.0.4",
    "vue-template-compiler": "^2.4.2",
    "webpack": "^3.4.0"
}
```