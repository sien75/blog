<h1>MusicMaker编写记录2-项目基本架构</h1>

我把软件的核心功能抽了出来, 建立了一个`MusicMaker`库, 这样的好处一方面是"模块化", 把"核心功能"和"使用"分离, 这样每部分功能更加清晰易修改. 另一方面, 任何人都可以使用这个`MusicMaker`库, 按照自己的创意构建页面.

<!--more-->

**项目地址: <https://github.com/sien75/musicmaker>**

**本次版本: <https://github.com/sien75/musicmaker/tree/7e567a7206789da7edd2ebaae0c977188cc4c868>**

**Docs: <https://sien75.github.io/musicmaker>**

## 架构图

先放上组件结构图供参考:

![image](./component_relations.svg)

## 从如何使用说起

如何使用`MusicMaker`库呢? 作为一个npm库, 当然是通过以下命令引入!
```shell
npm i musicmaker
```
该库使用React编写而成, 实际上是一个React组件, 所以仅仅支持React编程使用. 如果您不会的话, 恐怕要先学习一下React了╮(╯▽╰)╭.

> 当然我在`MusicMaker`这个项目本身用库的话(即自产自用), 就不必再去npm上引了,配置好Webpack和TypeScript的别名就可以像调用npm库一样调用了.

当使用`MusicMaker`库时就像下面这个样子:
```ts
const rules: Rules = ...;
const timbres: Timbre[] = ...;

ReactDom.render(
        <MusicMaker
            rules={rules}
            timbres={timbres}
        />,
        document.getElementById('app')
    );
```

相应地, 在上述代码前, 当然需要引入以下库和类型:
```ts
// react, 用于支持JSX语法
import React from 'react';
// react的DOM渲染
import ReactDom from 'react-dom';
// MusicMaker库(组件)
import MusicMaker from 'musicmaker';
// Rules和Timbre类型
// 用于TypeScript, 使用JavaScript的话无需引入
import { Rules, Timbre } from 'musicmaker/_types';
// MusicMaker库的CSS文件
import 'musicmaker/index.css';
```

> 对的, 这就是`MusicMaker`库的基本使用方法, 将来如果写成Docs, 那么这块代码一定会被放在"Quick Start"部分.

不过这篇文章并非教程, 展示用法是为了分析并记录我编写`MusicMaker`库的架构.

这是一个**React组件**, 包含2个props:
* `rules`
* `timbres`

那接下来就从这2个props介入, **由大到小**, 逐步分析项目架构.

## MusicMaker Root组件的2个props

### prop之`rules`

`rules`这个prop接受`Rules`类型的对象, 这一类型定义在`src/_types/types.ts`里面:
```ts
// src/_types/types.ts
export type Rules = RulesMidiUrl | RulesJsonUrl | RulesObject;
```
这个prop的作用为**确定乐谱和位置这两个规则类信息**. 你想, 我这个组件要播放音乐, 你总得给我乐谱吧? 我这个组件有很多小组件, 比如说有钢琴有架子鼓等等, 那这些小组件该怎么布局? 所以得有个位置信息吧.

给定乐谱和位置信息的方法有3种:
* 给mid文件的url, 那就确定了乐谱, 各小组件的位置则会取默认的空值
* 给一个json文件的url, 这个json文件内定义了乐谱和位置信息
* 直接给乐谱(Midi类型对象)和位置(MmComponentAppearances类型对象)

```ts
// src/_types/types.ts
interface RulesMidiUrl {
    type: 'midiUrl';
    url: string;
    controllerAppearance: ControllerAppearance;
}

interface RulesJsonUrl {
    type: 'jsonUrl';
    url: string;
    controllerAppearance: ControllerAppearance;
}

interface RulesObject {
    type: 'object';
    midi: Midi;
    mmComponentAppearances: MmComponentAppearance[];
    controllerAppearance: ControllerAppearance;
}
```

我们需要的信息为midi和mmComponentAppearances, 所以我们可直接用的情况为第3种, 前2种需要转换一下.

```ts
// 第1种
const rules = {
    type: 'midi',
    url: 'https://xxx.com/xxx.mid',
};
```
第1种获得的mid文件可以使用@tonejs/midi提供的方法转换成midi; 此时未提供位置信息, 因此会将mmComponentAppearances设置为空数组.

```ts
// 第2种
const rules = {
    type: 'json',
    url: 'https://xxx.com/xxx.json',
};
```
第2种获得的json文件内为一个对象, 其中应该包含`midi`和`mmComponentAppearances`这2个key值.

```ts
// 第3种
const rules = {
    type: 'object',
    midi: a_Midi_type_object,
    mmComponentAppearances: a_MmComponentAppearance_type_object,
};
```

此外, Rules中controllerAppearance字段代表控制器的位置信息.

### prop之`timbres`

`timbres`这个prop接受`Timbre[]`类型的数组, 这一类型定义在`src/_types/tone.ts`里面:
```ts
// src/_types/tone.ts
export interface Urls {
    [name: string]: string;
}
export interface Timbre {
    number: number;
    baseUrl: string;
    urls: Urls;
}
```
这个prop的作用是**引入音源**. 也就是说, rules是提供的做菜的方法, 而timbre提供的就是做菜的原料.

每一个Timbre代表一个乐器, Timbre类型中:
* number, 就是一个唯一标识符, 用来代表该乐器
* urls, 是一个对象
    * key值为音符, value为音源url
* baseUrl, 每个urls的前缀base

举例:

```js
const timbres: Timbre[] = [
    {
        number: 0,
        baseUrl: 'https://tonejs.github.io/audio/salamander/',
        urls: {
            A0: 'A0.mp3',
            C1: 'C1.mp3',
            'D#1': 'Ds1.mp3',
            'F#1': 'Fs1.mp3',
            A1: 'A1.mp3',
            C2: 'C2.mp3',
        },
    },
];
```

使用baseUrl和urls拼接的地址代表一个音频文件, 称之为: Sample, 即"样本".

tonejs库可以使用少数的音符样本模拟出其他的音符, 比如说根据C4模拟出D4, 当然模拟出来的音色肯定不好, 最好是提供足够多的音符样本.

## Container组件

`index.tsx`文件解析2个MusicMaker Root组件的props后, 获得了3部分:
* midi, 乐谱
* mmComponentAppearances, Musicmaker Component的样式
* controllerAppearance, Musicmaker Controller的样式
这些数据会传给Container组件.

另外, `index.tsx`中还会初始化一个[tone实例](#tone对象), 用于控制声音部分, 一并传给Container组件.

```ts
// src/index.tsx
return (
    <Container
        tone={tone}
        midi={midi}
        mmComponentAppearances={mmComponentAppearances}
        controllerAppearance={rules.controllerAppearance}
    />
);
```

### Container组件对props的解析

Container组件内部会对mmComponentAppearances进行解析, 获得mmComponentValues.

解析结果示例:
```json
// mmComponentValues
{
    show_simple-1: {
        component: /* MusicMaker Component */,
        track: /* Track of a channel */,
        position: /* position of this MusicMaker Component */,
    },
    show_null-2: {
        component: /* MusicMaker Component */,
        track: /* Track of a channel */,
        position: /* position of this MusicMaker Component */,
    }
}
```

Container组件内部会对controllerAppearance进行解析, 获得controllerComponentValue, 包含了Controller组件和其位置信息.

解析结果示例:
```json
// controllerComponentValue
{
    component: /* MusicMaker Controller Component */,
    position: /* position of MusicMaker Controller Component */,
}
```

### Container组件内的schedule

Container组件内有一个用于规划的变量, 这个变量的结构如下:
```json
{
    should: boolean,
    total: number,
    current: number,
}
```
逻辑如下:
* mmComponentAppearances变动 -> total = 条目数
* Controller组件内start方法 -> 监听total和current
    * total === current -> should = false, 开始播放
    * total > current -> should = true
* MusicMaker Component组件内 -> 监听should
    * should === true -> 加载乐谱, current = current + 1

### 传参结果

最终, Controller组件和MusicMaker组件的传参如下:
```jsx
<Layout position={controllerComponentValue.position}>
    <Controller
        tone={tone}
        scheduled={scheduled}
        setScheduled={setScheduled}
    />
</Layout>
```
```jsx
<Layout position={position}>
    <MmComponent
        tone={tone}
        track={track}
        scheduled={scheduled}
        setScheduled={setScheduled}
    />
</Layout>
```
