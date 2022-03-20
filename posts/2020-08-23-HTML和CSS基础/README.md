<h1>HTML和CSS基础</h1>

本文包含了部分HTML, CSS的内容, 是阅读[MDN中文文档](https://developer.mozilla.org/zh-CN/)的HTML和CSS部分, 以及[Sass快速入门](https://www.sass.hk/guide/)做下的笔记, 不是教程, 不以总结全面为目标, 仅仅是记录下自己觉得有价值的点, 作为参考.

<!--more-->

## 关于HTML5
所谓的HTML5, MDN上解释得很清楚: "它是一个新版本的HTML语言, 具有新的元素, 属性和行为. 另一方面它有更大的技术集, 允许构建更多样化和更强大的网站和应用程序. 这个集合有时称为HTML5和它的朋友们, 不过大多数时候仅缩写为一个词 HTML5." 所以, 广义HTML5中的HTML含量并不是很多.

我觉得HTML5标准中很多都是浏览器方面的, 比如说离线存储, 性能集成, 设备访问这些; 而像新支持的WebSocket是属于网络方面的, HTML5提供了访问它的Web Api; 对像音频视频这些多媒体的支持, 以及像canvas图像编程的支持, 就都是具体的应用技术点了. 所以去掉不纯的, 剩下的关于HTML的也没多少, 我把拖放, 表单部分以及区块和段落元素放在这里了. 那些"HTML5的朋友们", 而且比较重要的, 我就分别在其他领域总结了.

## HTML5拖放

考虑到我有可能要使用到SVG, 并且进行拖放, 所以我打算学习一下HTML5的拖放. 要使元素可拖放, 需要设置其`draggable`属性为`true`, 不过图片和链接默认下可拖放, 选中的文本也是默认可以拖放的.

被拖动的元素有以下事件:
- dragstart, 在元素拖动开始时触发
- drag, 在元素拖动时触发
- dragend, 在拖动完成时触发
目的地元素有以下事件:
- dragenter, 被拖动元素进入时触发
- dragover, 被拖动元素处于该元素中时触发
- dragleave, 被拖动元素离开时触发
- drop, 释放被拖动元素时触发

把某一个元素(ele0)拖动到另一个元素(ele1)上面:
```javascript
ele0.ondragstart = function (e) {
    e.dataTransfer.setData('Text', e.target.id);
}
ele1.ondragover = function (e) {
    e.preventDefault();//默认是不允许放置的
}
ele1.ondrop = function (e) {
    let id = e.dataTransfer.getData('Text');
    e.target.appendChild(document.getElementById(id));
}
```

## HTML5表单

1. input的类型(type字段)有所增加, 不是所有的浏览器都支持, 主要包含下列:
    - color, 颜色选取盘
    - month, 月份选择器
    - date, 日期选择器
    - datetime-local, 日期和时间选择器
    - time, 时间选择器
    - email, email格式验证
    - number, 数字框
    - range, 滑动条
    - search, 搜索框, 会在右侧显示'x'图标

2. 新表单元素:
    - datalist元素, 有自动完成功能, 输入字符会提示相应的结果

## HTML5区块和段落元素

一个典型的HTML5网页`<body>`标签内的结构:
```html
<header>
    <h1>标题</h1>
    <nav>链接</nav>
</header>
<main>
    <nav>目录</nav>
    <article>
        <header>
            <h2>文章标题</h2>
            <address>作者介绍</address>
        <header>
        <section>
            <h3>部分标题</h3>
            <p>段落</p>
            <p>段落</p>
            ...
        </section>
        <section></section>
        ...
    </article>
    <article>文章</article>
    ...
    <aside>
        <article>小组件</article>
        <article>广告组件</article>
        ...
    </aside>
</main>
<footer>
    <p>版权声明</p>
    <address>联系方式</address>
</footer>
```

## 关于CSS

我的CSS也就差不多是工地水平, 平时也是直接用第三方库的定位来写网页, 而且很多时候就用绝对定位, 所以我觉得有必要在CSS基础上花一点时间.

## CSS层叠与继承

1. CSS叫做层叠样式表(Cascading Style Sheets), 其中"**层叠**"的规则很重要:
   - 同一元素上的同优先级的规则, 写在后面的会被实际利用
   - 元素选择器越具体, 它的**优先级**越高, 越会被实际利用

    有一些CSS属性可以由父元素那里**继承**而来.   
    这是CSS的3个基本概念. 

2. CSS属性中, 有些会默认继承, 如文本相关属性, 有些不会默认继承, 这"很大程度上是由常识决定的". CSS为控制继承机制提供了3个通用值(说实话我觉得这3个值的区别挺费解的,就简要总结了,不一定完全准确):
   - inherit, 一定会继承
   - initial, 和浏览器默认样式持同(如字体颜色是黑色)
   - unset, 默认继承的继承, 不继承的不继承

    可以使用all属性来重新设置所有属性, 当然all属性的值只能是上面中的一个.

3. 一个选择器的优先级可以说是由四个部分组成:
   - 千位, 如果是内联样式则得一分(内联样式没有选择器所以总是1000分)
   - 百位, 选择器中包含ID选择器则该位得一分
   - 十位, 选择器中包含类选择器, 属性选择器或者伪类则该位得一分
   - 个位, 选择器中包含元素, 伪元素选择器则该位得一分

    | 选择器 | 优先级 |
    | :---: | :----: |
    | h1 | 0001|
    | p::first-letter + .name | 0012|
    | #name > div:hover | 0111|
    | 内联样式 | 1000|

4. `!important`可以用来覆盖优先级计算, 优先使用该CSS规则. 当然, 也可以用更高优先级或更靠后的标有`!important`的CSS规则来覆盖已有的`!important`规则. 不建议使用`!important`, 不过在某些时候, 这一特性很有用. 比如, 用户想让页面内所有元素放大一倍, 那么`!important`就很有用了.

## CSS选择器

1. 关于类型, 类和ID选择器, 不再赘述.

2. 属性选择器:
    - `[attr]`, 匹配带有attr属性的元素
    - `[attr="value"]`, 匹配带有attr属性的元素, 且attr属性值为"value"
    - `[attr~="value"]`, 匹配带有attr属性的元素, 且attr属性值中(由空格隔开)至少有一个为"value"
    - `[attr|="value"]`, 匹配带有attr属性的元素, 且attr属性值为"value", 或以"value-"开头
    - `[attr^="value"]`, 匹配带有attr属性的元素, 且attr属性值以"value"开头
    - `[attr$="value"]`, 匹配带有attr属性的元素, 且attr属性值以"value"结尾
    - `[attr*="value"]`, 匹配带有attr属性的元素, 且attr属性值含有"value"字段
    - `[attr="value" i]`, 匹配带有attr属性的元素, 大小写不敏感(HTML默认大小写敏感)

3. 伪类选择器是指向已存的元素添加效果, 伪元素选择器是创建新元素并向新元素添加效果, 常用的伪类和伪元素选择器如下:
    - :first-child
    - :last-child
    - :only-child, 是指匹配没有兄弟元素的子元素, 即匹配"独生子女"
    - :hover
    - :focus
    - ::first-letter
    - ::first-line

4. 关系选择器:
    - 后代选择器` `
    - 子代选择器`>`, 仅会匹配直接子代
    - 邻接兄弟选择器`+`, 选择该元素之后的兄弟元素
    - 兄弟选择器`~`, 选择该元素的所有兄弟元素

## CSS盒模型

1. **块级盒子**在水平方向上会扩展所有可用空间, 即和父容器等宽; 每个盒子都会换行; width和height属性起作用; padding, margin和border会将其他元素从当前元素推开.

    **内联盒子**不会换行; width和height属性不起作用; 垂直方向padding, margin和border会被应用但不会推开其他内联盒子; 水平方向padding, margin和border会被应用也会推开其他内联盒子.

    元素的`display`属性会改变其外部显示类型.

2. 在**标准盒模型**中, 设置width和height实际上设置的是content. 在**替代盒模型**中, 设置width和height设置的是content+padding+border. 默认情况下浏览器使用标准盒模型, 如果想启用替代盒模型, 需要在相应的元素上加入`box-sizing: border-box`CSS规则.

3. 按照我的使用经验, 一般情况下一个元素大小和位置由width和height, top和left系列, 以及right和bottom系列中的2个就可以确定, 如果规定了width和padding-left, 那padding-right的值就不会影响布局了.

    margin可以设置为负值, 会收缩空间; padding不可以设置为负值.

4. 所谓外边距折叠, 是指两个外边距相接的元素, 它们的外边距会合并成为一个, 即较大的那个外边距.

5. 边框可以按照上下左右设置, 也可以按照不同的样式来设置. 设置的方式有: `boder: 1px solid red` `border-top: dashed red` `border-style: dotted` `border-width: 1px` `border-color: red` `border-top-color: red`.

    设置边框圆角可以使用`border-radius: 10px / 10% 20px 10px`, 这等同于
    ```css
    #ele {
        border-top-left-radius: 10px 10%;/*水平半径10px, 垂直半径10%高度*/
        border-top-right-radius: 10px 20px;
        border-bottom-right-radius: 10px 10px;
        border-bottom-left-radius: 10px 20px;
    }
    ```

## CSS布局

1. 在不使用flex(弹性盒子), float(浮动), position(定位)以及multicol(多列)等布局时, 默认的布局方式称为正常布局流.

    **浮动**是在网页上创建多列布局的工具之一, 通过设置float的值可以使元素想向左或向右浮动:
    ```css
    #ele {
        float: left;/*right, none(默认)*/
    }
    ```
    由于不浮动的元素会围绕浮动的元素布局, 所以如果不想使其他元素围绕浮动的元素, 需要在该元素上添加如下CSS规则:
    ```css
    #ele {
        clear: both;
    }
    ```
    当然, 浮动的元素在正常文档布局流之外, 非浮动元素的外边距不能用于和浮动元素之间来创建空间, 所以最好的解决办法是新建一个元素来消除浮动:
    ```html
    <div style="clear: both;"></div>
    ```

    通过不同的定位方式进行布局:
    - 相对定位`position: relative`后元素仍会占据在正常文档流中, 但是视觉上的位置会发生偏移, 偏移量是按照它本来的位置来算的. 通过设置`top` `bottom` `left` `right`属性来设置该元素的相对位置.
    - 绝对定位`position: absolute;`会逐层寻找position属性不是`static`的父元素, 并以这个元素作为定位基准. 如果找不到, 也就是说该元素的所有父元素都是静态定位, 那它会以初始块容器(浏览器视口)来定位.
    - 固定定位`posiiton: fixed;`和绝对定位类似, 但是总是以初始块容器来定位的.
    - 粘性定位`position: sticky`会首先表现得跟相对定位一样, 直到滚动到某个阈值后会表现得跟固定定位一致. 

2. **flex**是一种新型按行或按列布局元素的**一维布局方法**, 它可以很方便地解决子元素垂直居中以及占用等量宽度/高度等问题. 要使用flex布局, 需要在父元素(flex容器)上添加如下CSS规则:
    ```css
    #ele {
        display: flex;
    }
    ```

    flex元素放置方向的轴叫做主轴, 垂直于主轴方向的轴叫做交叉轴, 可以通过`flex-direction`项设置主轴方向; 通过`flex-wrap`项可以设置是否换行. 这两项设置可以合并起来, 用`flex-flow`取代:
    ```css
    #ele {
        flex-flow: row nowrap;
        /*等同于*/
        flex-direction: row;
        flex-wrap: nowrap;
    }
    ```

    可以通过在flex项上添加`flex`规则来控制其尺寸, 该值有3个参数, 分别代表剩余空间索取量`flex-group`, 超出空间缩短量`flex-shrink`和主轴上的长度`flex-basis`(会覆盖width和height值). 此外, `flex`还有几个简写值:
    ```css
    /*两者意思等同, 表示会缩短来适应容器, 但不会索取剩余空间, 并根据自己的width和height来设置尺寸*/
    #ele {
        flex: initial;
        flex: 0 1 auto;
    }
    ```
    ```css
    /*两者意思相同, 表示会索取剩余空间, 会缩短来适应容器, 并根据自己的width和height来设置尺寸, 义如其名"自动"*/
    #ele {
        flex: auto;
        flex: 1 1 auto;
    }
    ```
    ```css
    /*两者意思相同, 表示既不索取, 也不缩短, 完全按照设定的width和height设置尺寸, 成为非弹性元素*/
    #ele {
        flex: none;
        flex: 0 0 auto;
    }
    ```
    *[关于flex三个值含义可参考这里](https://www.cnblogs.com/moxiaowohuwei/p/8267624.html)*

    通过在flex容器上设置`align-items`属性控制flex项在交叉轴上的位置, 可选值有
    - stretch(默认), 交叉轴方向拉伸填满
    - center, 保持原长度且居中
    - flex-start/end, 保持原长度且居起始/结束位置

    通过在flex容器上设置`justify-content`属性控制flex项在主轴上的位置, 可选值有
    - flex-start(默认), 将flex项布局到主轴起始处
    - flex-end, 将flex项布局到主轴结尾处
    - center, 将flex项居中布置
    - space-around, 将flex项沿主轴均匀分布, 且在两端留下一点空间
    - space-between, 将flex项沿主轴均匀分布, 在两端不留空间

3. BFC(块级格式化上下文)是块盒子布局发生的区域, 属于正常布局流, 它相当于一个容器, 保证容器内部元素不会在布局上影响外部元素. 触发BFC有以下几种方式:
    - body根元素
    - 浮动元素
    - 绝对定位元素和固定定位元素
    - overflow: auto / hidden / scroll的元素
    - display: inline-block / flow-root / flex的元素

    BFC主要用于以下几种场景:
    - 消除外边距折叠, 同一个BFC内元素会发生外边距折叠, 把这两个元素放在不同的BFC内就不会折叠了
    - BFC可以包含浮动的元素, 由于浮动的元素脱离了正常布局流, 导致其突出父容器, 触发父容器的BFC就可以使父容器完整包含浮动元素
    - BFC元素不会围绕浮动元素, 所以有清除浮动的效果

4. 关于水平居中, 垂直居中.
    - 父元素是内联元素, 那父元素完全由子元素撑开, 设置父元素的padding或子元素的margin就可以居中了
    - 父元素是块级元素
      - 子元素是块级元素, 设置了宽度, 可以使用`margin: 0 auto;`水平居中
      - 子元素是块级元素, 设置了相对宽度或高度, 那就可以设置`margin`为百分值, 直接水平居中或垂直居中了
      - 子元素是内联元素, 可以在父元素上使用`text-align: center;`水平居中
    - 父元素是块级元素, 设置了绝对宽度或高度
      - 子元素是块级元素, 设置了绝对宽度或高度, 可以直接计算并设置`margin`, 水平居中或垂直居中
    - 除了这些, 还有普适的方法, 特别适合子元素是块级元素且未设置宽度高度的情况
      - flex布局(推荐)
      - 使用transform(因为其百分值能代表自身长宽的百分比), 水平方向上`margin-left: 50%;`或绝对定位`left: 50%;`, 垂直方向上, 由于正常布局流下百分值按内联方向(参考CSS杂项第4条), 所以只有绝对定位`top: 50%`的方法. **其实只要使子元素一角居中, 然后用transform位移半个身位即可**
      - 绝对定位下, 设置子元素宽高, 以及top, left, bottom, right为0, `margin: auto`即可居中布置

## CSS背景

1. 设置背景颜色: `background-color: rgba(0, 0, 0, 0.1)`.

2. 设置背景图片, 背景图片会覆盖背景颜色:
    ```css
    #ele {
        background-image: url(...);
        background-repeat: no-repeat;
        /*或repeat, repeat-x, repeat-y*/
        background-size: 100px 60px;
        /*或cover-保持高宽比且图像足够大可能超出区域, contain-保持高宽比图像完全显示可能有间隙*/
        background-position: 10px 5px;
        /*或top center, top 10px left 5px这样的4-value写法*/
    }
    ```

3. 渐变:
    ```css
    #ele {
        background-image: linear-gradient(105deg, red, 10%, black, 90%);
        background-image: radial-gradient(circle, red, 10%, black, 90%);
    }
    ```

4. 可以设置多个background-image值, 按照顺序, 前者会覆盖后者:
    ```css
    #ele {
        background-image: url(upper.png), url(lower.png), radial-gradient(circle, red, 10%, green, 90%);
        background-repeat: repeat, no-repeat;/*循环应用, 所以上面的渐变背景应用的"repeat"属性*/
    }
    ```

5. 使用background的简写, 前面的背景会覆盖后面的背景, 背景颜色需要再最后指定, 位置和大小需要以position/size格式指定:
    ```css
    #ele {
        background: url(star.png) no-repeat center center / 50px 50px,
            linear-gradient(90deg, red, 10%, green, 90%),
            purple;
    }
    ```

## CSS杂项

1. CSS溢出
    ```css
    #ele {
        overflow: hidden;/*visible(默认值), scroll, auto*/
    }
    ```
    或分别指定两个方向:
    ```css
    #ele {
        overflow: auto hidden;
    }
    ```
    或者这样:
    ```css
    #ele {
        overflow-x: auto;
        overflow-y: scroll;
    }
    ```
    当x和y两个值有一个是visible另一个不是的话, 那visible会被改为auto, 所以下面两个等价:
    ```css
    #ele {
        overflow-x: scroll;
        /*等价于*/
        overflow-x: scroll;
        overflow-y: auto;
    }
    ```

2. CSS字体主要包括如下一系列设置:
    ```css
    #ele {
        color: red;
        font-family: sans-serif;
        font-size: 1.2em;
        font-style: normal;/*italic*/
        font-weight: normal;/*bold*/
        text-transform: none;/*uppercase, lowercase, capitalize, full-width*/
        text-decoration: none;/*underline, overline, line-through*/
        text-align: left;/*right, center, justify*/
        line-height: 1.5;
    }
    ```

3. 使用`calc`函数可以方便地在CSS中进行计算:
    ```css
    #ele {
        width: calc(10px + 10% + 2vw);/*注意+和-前后要有空格*/
    }
    ```

4. 使用百分值设置内外边距时, 是按照内联尺寸(汉语英语都是左右方向)计算的, 也就是说下面的设置会把所有内边距都设置为其父元素的**宽度**的10%.
    ```css
    #ele {
       padding: 10%;
    }
    ```

5. 使用min-和max-来设置高度和宽度的最小值和最大值.
    ```css
    #ele {
        min-height: 50px;
    }
    ```

6. `10px`是指绝对大小为10像素, `1.5em`是指1.5倍于父元素字体大小, `1.5rem`是指1.5倍于根元素字体大小, `1vh`是指视口高度的1%, `1vw`是指视口宽度的1%.

7. 使用`object-fit`设置图片的填充方式, 包含`contain` `cover` `fill`(充满, 可能会改变高宽比).
   
8. 使用媒介查询来确定屏幕大小:
    ```css
    @media screen and (min-width: 400px), screen and (max-width: 800px) {}
    ```

9. CSS的`transform`属性可以用于:
    - 绕(0, 0)点旋转`transform: rotate(180deg)`
    - 缩放`transform: scale(1.5, 2)`
    - 位移`transform: translate(100px, 50%)`
    - 倾斜`tranform: skew(30deg, 30deg)`

10. CSS的`transition`属性可以实现过渡效果, 用法如下:
    ```css
    #ele {
        transition: <proprerty> <duration> <timing-function> <delay>;
    }
    ```
    其中
    - <property>用来设置具体的过渡项, 如color, margin等, 可用all来设置全部变动项
    - <timing-function>用来设置缓动函数, 即过渡过程中属性怎么变化, 可取ease, linear等

    由于CSS的`transition`需要触发的事件, 不能重复执行, 且不能自定义中间态, 所以它的升级版`animation`出现.

## Sass简单介绍

1. 变量.
    ```scss
    $red-border: 1px solid red;
    div {
        border: $red-border;
    }
    ```

2. 嵌套.
   
    &代表父选择器:
    ```scss
    article a {
        color: blue;
        &:hover {
            color: red;
        }
    }
    ```
    使用关系选择器和群组选择器:
    ```scss
    main {
        #a, #b {
            color: red;
        }
        > #c {
            color: blue;
        }
    }
    ```
    属性嵌套:
    ```scss
    div {
        border 1px solid red {
            radius: 5px;
        }
    }
    ```

3. 导入.

    导入a.sass文件和_b.sass文件, 其中_b.sass不会生成独立的css文件, 仅被其他sass文件引用:
    ```scss
    @import "a";
    @import "b";
    ```

    为了防止引用文件中的规则对自己写的规则产生影响, 在写引用文件时要加上`!default`, 表示如果此变量已定义则使用其已定义好的值, 下面的例子中实际的变量值为blue:
    ```scss
    //_b.sass
    $color: red !default;
    ```
    ```scss
    //某个sass文件
    $color: blue;
    @import "b";
    ```

    嵌套导入:
    ```scss
    //_b.scss
    a {
        color: red;
        &:hover {
            color: blue;
        }
    }
    ```
    ```scss
    //某个sass文件
    div {
        @import "b";
    }
    ```

4. 混合器, 用于展示性样式的重用.
    
    普通用法:
    ```scss
    @mixin color-rules {
        a {
            color: red;
            &:hover {
                color: blue;
            }
        }
    }
    div#content {
        color: grey;
        @include color-rules;
    }
    ```
    传参:
    ```scss
    @mixin color-rules($hover-color) {
        a {
            color: red;
            &:hover {
                color: $hover-color;
            }
        }
    }
    div#content {
        color: grey;
        @include color-rules(blue);
    }
    ```

5. 继承, 用于语义化样式的重用.
    ```scss
    .notice {
        color: red;
    }
    .special-notice {
        @extend .notice;
        background-color: blue;
    }
    ```
