<h1>MusicMaker编写记录3-项目重构开启第3版</h1>

第2版的项目存在一些问题, 现重构为第3版. 这篇文章会讲讲我的重构思路.

## 为什么重构

一句话概括: 之前自己太菜了, 很多东西不了解o(╥﹏╥)o, 现在发现项目有很多的问题, 必须通过重构来解决.

随着Web前端开发阅历的增加, 我学习到了很多之前并不清晰的知识, 主要是和程序架构和编程思想有关. 这时再看之前的代码, 那就会发现很多问题. 那么项目有哪些方面的问题呢, 又需要进行怎样的重构呢?

## 使用方式重构

v2的使用方式是这样的:

```js
import MusicMaker from 'musicmaker';

function Comp() {
    return <MusicMaker rules={rules} timbres={timbres} >
}
```

> 代码中的组件叫做`MusicMaker根组件`, 每个展示块(如一个钢琴)都叫做`MusicMaker组件`, 而控制器部分则叫做`Controller组件`

所有的配置都以MusicMaker根组件的props传入. MusicMaker根组件分析rules里面的信息, 根据的名字找到内置的MusicMaker组件, 然后展示.

按照之前的设想, 如果需要自定义MusicMaker组件, 则应该在rules里传入这个MusicMaker组件.

虽然说不上原因, 但是就是感觉这种使用方法有问题, 不优雅, 有点"黑盒"的意思, 表现形式太过单一. 而且这样所有的实现都在MusicMaker根组件内部, 不利于后续的迁出React计划.

我比较喜欢React Hooks, 主要的原因是, React Hooks把状态和视图分离了. 组件结构越复杂, React Hooks的表现的优势就越明显. 既然React Hooks的使用方法更优雅, 所以我就一直在想: 怎么让我这个组件使用上Hooks.

左思右想, 考虑出下面这种方案:

```js
import { useShow, useController, SimpleController, Piano } from 'musicmaker-react';

function Comp() {
    const showData = useShow(rules, timbres);
    const controllerData = useController(rules);
    return (
        <div>
            <SimpleController {...controllerData} />
            <Piano {...showData} />
        </div>
    );
}
```

这样就把状态和视图分离了, 而且可以更加自由组合各组件, 不像之前那样, 只有一个大的根组件, 像个"黑盒"一样.

还有一个很重要的原因, 我计划之后是把这个项目迁出React体系, 我可以把状态相关的逻辑代码抽离出来, 这样更加便于和React脱离.

为了使项目更好迁移, 也为了精简单个项目的体积和功能, 我决定把项目一分为二:

* MusicMaker, 核心库, 含有核心逻辑, 仅依赖ToneJS等
* MusicMaker-React, 使用hooks对核心库包装, 并含有几个简单的组视图组件, 依赖MusicMaker和React

## MusicMaker核心库构建方式

不谈v2项目的构建方式了.

一个JavaScript库, 主要是发布到npm上. 这时构建结果一般有3个:

### xx.umd.js

首先是xx.umd.js, 这是比较常见的构建结果. 这种构建结果, 需要对源代码进行的转换有:
* TS -> JS (Webpack ts loader / Webpack babel loader)
* JSX -> JS (Webpack babel loader)
* ES next -> ES2015 (Webpack babel loader)
* 合并到一个文件 (Webpack)
* 压缩 (Webpack)

这种构建结果, 可用于全局对象, CommonJS(Node.js), CMD和AMD, 当然这种构建结果也主要是用在浏览器环境这一种场景.

不过在浏览器上使用script标签引入MusicMaker核心库需要注意依赖的问题. 目前MusicMaker核心库应该是需要几个和ToneJS相关的依赖, 需要注意手动引入这些库的构建文件, 可以在unpkg.com上获取.

### ESM

第二种构建结果是ESM, 即ES Module.

ESM构建结果需要对源代码进行的转换有:
* TS和JS分离
* JSX -> JS
* ES next -> ES2015

不需要把源代码合并到一个文件, 也不需要压缩, 一方面需要把JSX和ES next转换为ES2015语法, 另一方面是把TS文件分离为纯JS文件和TS声明文件.

### 如何同时输出UMD和CJS两种构建结果

一般情况下, 面向浏览器的项目, 会配合打包工具, 使用ESM方式引入, 并进行tree shaking.

对于这种情况, 有一个事实上的标准, 即`module`字段, 已经被Rollup, Webpack等打包工具支持. 如果使用Webpack打包工具, 那模块的管理是由Webpack全面接管的, Webpack也会优先读取`module`字段所指的文件.

而对于一般的UMD方式引入, 则使用`main`字段来进行标注, 以使得像unpkg这样的内容分发网站确定主文件的位置.

```json
{
    "main": "./lib/cjs/index.js",
    "module": "./lib/esm/index.js"
}
```

## MusicMaker核心库设计

`MusicMaker`核心库主要包含以下几个功能:
  * trigger(触发)功能, 这一部分用于适配play(演奏)场景
  * schedule(规划)功能, 这一部分用于适配show(展示)行场景
  * makeMidiJSON(制作MidiJSON)功能, 这一部分用于适配arrange(编曲)场景
  * convert(转换), 用于在url, buffer和MidiJSON之间转换

`MusicMaker` v3.0.0已在5月28日测试通过! 详细的使用方法见[MusicMaker项目](https://github.com/sien75/musicmaker).

## 目录调整

目录架构:

* musicmaker
  * src/, 核心库源代码
  * lib/, 核心库构建结果
    * esm/
    * umd/
  * draft/, 草稿文档
  * docs/, 文档
  * test, 测试文件
  * config/, 配置文件
  * script/, 脚本文件
  * .gitignore
  * tsconfig.json
  * package.json
  * yarn.lock
  * LICENSE
  * README.md
  * README_zh.md

* musicmaker-react
  * src/
    * hooks/, 包装核心库的React Hooks
    * components/, 几个简单的视图组件
    * base/, 依赖到的基础文件
  * lib/, 构建好的hooks和视图组件
    * esm/
    * cjs/
    * umd/
  * draft, 文档草稿
  * docs, 文档构建结果
  * config/, 配置文件
  * script/, 脚本文件
  * .gitignore
  * global.d.ts
  * tsconfig.json
  * package.json
  * yarn.lock
  * LICENSE
  * README.md
