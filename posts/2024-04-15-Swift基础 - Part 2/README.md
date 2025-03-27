<h1>Swift基础 - Part 2</h1>

以自己已经掌握的 TypeScript 语言, 和部分掌握的 C 语言出发, 记录一些针对 Swift 语言的不同之处.

## 函数

可选元组返回类型:

```swift
func a(v: Int) -> (Int, String)? {
    if a == 0 {
        return nil;
    }
    return (v, "q");
}
```

隐式返回(只有一行表达式):

```swift
func a() -> String {
    "q";
}
```

参数标签和参数名称:

```swift
func a(label name: String) {
    print(name);
}
a(label: "q");

// 使用参数名称作为参数标签
func a(name: String) {
    print(name);
}
a(name: "q");

// 省略参数标签
func a(_ name: String) {
    pring(name);
}
a("q");

// 可变参数(后面接的参数需要明确参数标签)
func a(_ v: Int..., name: Int) {
    print(v, name);
}
a(1, 2, 3, name: 4);

// 输入输出参数, 默认参数值是不能改变的
func a(v: inout Int) {
    v = 3;
}
a(v: &vv);
```

## 闭包

闭包有 3 类:

1. 全局函数
2. 嵌套函数
3. 闭包表达式

闭包表达式 (感受一下 Swift 语法的一步一步的简化吧...):

```swift
let names = ["Chris", "Alex", "Ewa", "Barry", "Daniella"];

// 使用函数
func backward(_ s1: String, _ s2: String) -> Bool {
    return s1 > s2
}
var reversedNames = names.sorted(by: backward);

// 使用闭包表达式
reversedNames = names.sorted(by: { (s1: String, s2: String) -> Bool in
    return s1 > s2
});

// 类型推断
reversedNames = names.sorted(by: { s1, s2 in return s1 > s2 } );

// 隐式返回
reversedNames = names.sorted(by: { s1, s2 in s1 > s2 } );

// 参数名称缩写
reversedNames = names.sorted(by: { $0 > $1 } );

// 甚至不需要闭包(运算符方法)
reversedNames = names.sorted(by: >);
```

尾随闭包表达式省略写法:

```swift
// 最后一个闭包表达式参数可移出括号
reversedNames = names.sorted { $0 > $1 };

// 把所有的尾随闭包都移出括号, 第一个闭包要省略掉参数标签
func a(f1: () -> Int, f2: () -> Int, f3: () -> Int) {
    print(f2())
}
a { 1 } f2: { 2 } f3: { 3 }

// 当然, 也可以仅将部分尾随闭包移出括号
func a(f1: () -> Int, f2: () -> Int, f3: () -> Int) {
    print(f2())
}
a({ 1 }) { 2 } f3: { 3 }

```

逃逸闭包. 传入的闭包, 不在父闭包内执行, 需要加`@escaping`, 而且也需要注意在类中显示使用`self`:

```swift
var a = { () in 2 };
var arrayOfA : [()->Int] = [];
var f = { (_ fun: @escaping () -> Int) in arrayOfA.append(fun)};
f(a);
```

## 并发

定义和调用异步函数:

```swift
func a() async throws -> Int { // async放在throws前面
    await Task.sleep(until: .now + .seconds(2), clock: .continuous)
    return 2
}
```

异步序列:

```swift
for try await a in aa() { // 每收到一个元素后即进行处理

}
```

并行调用异步方法:

```swift
async let a = aa();
async let b = bb();
let c = await (a, b);
```

任务和任务组:

```swift
// 结构化并发
await withTaskGroup(of: Data.self) { taskGroup in
    taskGroup.addTask { aa() }
    taskGroup.addTask { bb() }
}

// 非结构化并发
await Task {
    async let a = aa();
    async let b = bb();
    return await (a, b);
}

// 取消任务, 可能导致Task错误, 也可能返回nil/空, 也可能返回完成一半的工作
Task.cancel()
Task.isCancelled
```

并发底层使用多线程, 在多任务之间分享数据可以使用引用类型`actor`:

> 只有遵循`Sendable`协议的数据才能被actor使用, 这主要包含: 值类型, 仅包含不可变状态的类类型

```swift
actor A {
    var value: Int
    init() {
        value = 1
    }
}
a = A()
print(await a.value) // 涉及多线程, 这里必须使用await防止获取到中间状态
```
