<h1>Vue基础</h1>


本文包括了一些"面向面试"的Vue的基础知识, 不成体系, 不是教程, 包括一些零散的问题. 我只记录了我不是很清楚的一些问题, 或者我觉得有价值的问题.

<!--more-->

## Vue的实现

我首先花了几天时间, 参考<https://juejin.im/post/6844903605414133773#heading-12>的思路, 自己造了一个简单的Vue, 实现了Vue的很基本的几个功能:
- `v-bind:attr="value"`的单向属性绑定
- `:attr="value"`的单向属性绑定, 就是上一个的简写
- `v-on:event="handler"`的单向监听函数绑定
- `@event="handler"`的单向监听函数绑定, 就是上一个的简写
- `v-model="value"`双向属性绑定
- `{{variable}}`的单向模板传值
项目地址: <https://github.com/sien75/ToyVue>
代码解析: <>

## Vue不能检测的变动

1.  增加对象的属性, 包括:
    - obj.newProperty = value
    - arr[arr.length] = value
    - vm.newProperty = value
    - Object.assign(obj, anotherObj)
    这些都是向现存的对象中增加属性, 由于Vue会在初始化时对已存属性设置setter, 新增加的属性是无法检测到的.

2.  通过索引值设置数组内某一项的值:
    - arr[i] = value
    不清楚为什么, Vue并没有对数组内的基本数据类型使用`Object.defineProperty`做setter和getter特性设置, 而是改造了`Array.prototype`上的`push` `pop` `unshift` `shift` `splice`函数, 所以使用上述函数是可以监听到变动的.

3.  Vue无法监听变动的统一解决方法:
    - Vue.set(obj, name, value)
    - vm.$set(obj, name, value)
  
## Vue的生命周期

1.  初始化时的事件:
    - `beforeCreate`, 实例已创建, 数据未绑定
    - `created`, 数据已绑定, 虚拟DOM未渲染
    - `beforeMount`, 虚拟DOM已渲染, 未挂载到DOM上
    - `mounted`, 虚拟DOM已挂载到DOM上, 初始化完毕

    运行时的事件:
    - `beforeUpdate`, 数据已更新, DOM未更新
    - `updated`, DOM也已更新

    销毁时的事件:
    - `beforeDestroy`, 销毁前
    - `destroyed`, 销毁后

2.  初始化时, 父组件和子组件的加载顺序如下:

    - 父组件实例化
    - -1- 父`beforeCreate`
    - 父组件数据绑定
    - -2- 父`created`
    - 父组件虚拟DOM渲染
    - -3- 父`beforeMount`
    - 子组件实例化
    - -4- 子`beforeCreate`
    - 子组件数据绑定
    - -5- 子`created`
    - 子组件虚拟DOM渲染
    - -6- 子`beforeMount`
    - 子组件虚拟DOM挂载到父组件虚拟DOM上
    - -7- 子`mounted`
    - 父组件虚拟DOM挂载到DOM上
    - -8- 父`mounted`

3.  父组件访问子组件钩子函数的方法:
    ```html
    <child-component @hook:created="function"></child-component>
    ```

## 组件的data属性为什么是一个函数

Vue实例的`data` `methods` `computed`都是在实例`vm`上的, 不同的实例调用的是一个类(构造函数模式), 但是数据不共享.

和Vue实例不同, 组件需要复用, 所以组件的`data` `methods` `computed`都是在`Component.prototype`上的(原型模式).

对于`methods` `computed`来说, 他们本来就是函数, 为了复用, 放在原型上是最佳选择. 而`data`本来是一个对象, 由于多个相同组件的`data`不大可能一样, 所以`data`需要放在组件实例`component`上.

像Vue这种设置`data`为函数, `data`函数里面`this`会指代实例`component`本身, 所以多个组件的数据就会被放在各自的实例上, 从而隔离.

当然其实Vue也可以在实现的时候就可以把像`data`这种每个组件都不同的属性特殊对待, 在初始化时就放到实例上, 这样就不用把`data`设为函数了.

## 组件间通信

1.  父组件和子组件之间的`props`和`$emit`, 不用多说.

2.  可跨组件的`$attrs`和`$listeners`.

    `$attrs`指从父组件中获取的所有数据, 但是要去除已在`props`字段接收到的, 也要去除`class`和`style`.

    `$listeners`指从父组件中获得的所有监听函数

    所以在一个A - B - C三组件继承体系中, B组件中就可以这么写:
    ```html
    <C v-bind="$attrs" v-on="$listeners" ></C>
    ```

3.  所有组件之间都可以通信的`EventBus`.

    其实原理很简单. 首先要明确一件事, 在Vue实例上`this.$emit()`发出的事件, 要怎么接收呢? Vue实例没有父组件, 该事件也没有绑定到某一个元素节点上, 要接受需要使用`this.$on()`监听.

    `EventBus`就是把Vue实例放到`Vue.prototype`上, 由于Vue组件类继承自Vue类, 所以所有组件都可以访问到Vue实例, 那么都可以使用这一事件收发平台了. 例子如下:
    ```js
    //实例化Vue类时
    Vue.prototype.$EventBus = new Vue();
    ```
    ```js
    //任意组件发送事件
    this.$EventBus.$emit('event', value);
    //任意组件接收事件
    this.$EventBus.$on('event', v => {});
    ```

4.  `$parent`, `$children`和`$root`.

    这个很简单, `$parent`访问到的就是父组件, `$children`访问到的就是所有子组件, `$root`访问到的就是根实例.

5.  使用ref.
    ```html
    <!-->html部分<-->
    <div ref="div"></div>
    <Child ref="child"></Child>
    ```
    ```js
    //js部分
    this.$refs.div;//div元素节点
    this.$refs.child;//子组件
    ```

6. Vuex方法, 适合大型项目. 关于Vuex, 详见下一部分.

## Vue状态管理 -- Vuex

1.  如何引入.
    ```js
    import Vue from 'vue'
    import Vuex from 'vuex'
    const store = new Vuex({...});
    Vue.use(Vuex);
    new Vue({
        store,
        ...
    });
    ```

2.  State -- 状态对象.

    在Vue实例中访问state是通过computed来实现的:
    ```js
    //定义时
    new Vuex({
        ...,
        state: {
            count: 0
        }
    })
    //访问时
    computed: {
        count() {
            return this.$store.state.count
        }
    }
    //使用mapState函数简化
    computed: {
        ...mapState(['count'])
    }
    //更复杂的mapState用法
    computed: mapState({
        count0: state => state.count + 1,
        count1: 'count',
        countPlusLocal(state) {
            return state.count + this.localCount
        }//函数运行时绑定到Vue实例上, 所以this指Vue实例(不能用箭头函数)
    })
    ```

3.  Getters -- 派生状态.

    Getters类似于computed. 通过属性访问:
    ```js
    //定义时
    new Vuex({
        ...,
        getters: {
            a: state => state.count + 1,
            b: (state, getters) => state.count + getters.a
        }
    })
    //访问时
    computed: {
        b() {
            return this.$store.getters.b
        }
    }
    //使用mapGetters函数简化
    computed: {
        ...mapGetters(['b'])
    }
    ```

4.  Mutations -- 变更状态.

    通过提交事件来执行mutations函数, 进而变更状态:
    ```js
    //定义时
    new Vuex({
        ...,
        mutations: {
            increment(state, {amount}) {
                state.count += amount
            }
        }
    })
    //访问时
    this.$store.commit('increment', {amount: 10});
    this.$store.commit({
        type: 'increment',
        amount: 10
    });
    ```

5.  Actions -- 可异步提交Mutations.

    为了便于调试, Mutations里的函数都应该是同步函数. 如果需要用到异步函数, 需要actions:
    ```js
    //定义时
    new Vuex({
        ...,
        actions: {
            incrementAsync({commit}) {
                return new Promise(reslove => {
                    setTimeout(() => {
                        commit('increment', {ammount: 10});
                        reslove();
                    }, 100)
                })
            }
        }
    })
    //访问时
    (async function () {
        await this.$store.dispatch('incrementAsync');
    })()
    ```

## 其他

1.  Vue SSR即Vue服务端渲染, 是指在服务器上将Vue模板渲染为HTML字符串, 再将它们发送到浏览器. 所以它会提高浏览器中内容加载速度, 同时也给了服务器更多的负载.

2.  Vue Router有3种:
    - hash模式, 利用的是location.hash
    - history模式, 利用history.pushState的无刷新更改地址栏
    - abstract模式, Node.js没有Web API, 只能用这种方式