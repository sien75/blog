<h1>Swift基础 - Part 1</h1>

以自己已经掌握的TypeScript语言, 和部分掌握的C语言出发, 记录一些针对Swift语言的不同之处.

## 数值

   1. 整型: `Int` `UInt`, 8 16 32 64位.
   2. 浮点数, `Double` 64位, `Float` 32位.
   3. `0b`二进制, `0o`八进制, `0x`十六进制.
   4. `1.25e2` 表示 1.25 × 10^2; `0xFp2` 表示 15 × 2^2 (十六进制浮点数必须有指数).
   5. 类型转换: Int(3.14), 四舍五入.
   6. Swift支持类型别名: `typealias AudioSample = UInt16`.

## 运算符

区间运算符:

```swift
let a = 0...5;
for i in 0...5 {
    print(i);
}
```

半开区间运算符:

```swift
let a = 0...<5;
for i in 0...<5 {
    print(i);
}
```

单侧区间运算符, 如省略了初始值则不能遍历, 如省略了最终值虽可遍历, 但要明确终止条件:

```swift
for i in 0... {
    print(i);
    if(i == 3) {
        break;
    }
}
```

可以使用单侧区间遍历数组的部分:

```swift
for name in names[2...] {
    print(name)
}
for name in names[...2] {
    print(name)
}
```

## 指定清理操作

defer可以使语句在离开代码块时执行, 不能包含throw语句, 控制转移语句(break语句和return语句):

```swift
func processFile(filename: String) throws {
    if exists(filename) {
        let file = open(filename)
        defer {
            // 倒数第一个执行
            close(file)
        }
        defer {
            // 倒数第二个执行
            close(file)
        }
        while let line = try file.readline() {
            // 处理文件。
        }
    }
}
```

## 元组

元素未命名, 可以通过下标访问:

```swift
// set
let http404Error = (404, "Not Found");

// get
let (statusCode, _) = http404Error;
http404Error.0;
```

元素已命名, 既可以通过下标访问, 也可以通过名字访问:

```swift
// set
let http404Error = (statusCode: 200, description: "OK");

// get
let (code, desp) = http404Error;
http404Error.0;
let (statusCode: code, description: desp) = http404Error;
http404Error.statusCode;
```

## if语句

if语句的条件只能是布尔值.

可选绑定, 当可选类型变量不是`nil`时满足条件:

```swift
if let a {
    print(a);
} else {
    print("nothing");
}
```

if语句可以包含多个条件, 互相是"且"的关系:

```swift
if let a = Int(code), let b, c > d {}
```

## 错误处理

错误需要使用枚举声明:

```swift
enum YourError: Error {
    case a
    case b(v: Int)
};
```

使用`throw`抛出错误:

```swift
throw YourError.b(v: 1);
```

`do-catch`处理错误 (注意只能catch预期的错误, 也就是throw的错误; 无法catch运行时错误):

```swift
// method 1
do {
    // some code
} catch YourError.a {
    // some code
} catch {
    // some code
}
```

错误本身不会传递出函数, 需要通过throws关键字表明该函数会抛出错误:

```swift
func canThrowErrors() throws -> String {
    return "q";
}
```

执行函数时, 必须需要使用`try` `try?` `try!`关键字.

`try`关键字执行可能会抛出错误的函数, 此时错误必须在外层被catch, 否则编译不通过:
```swift
func canThrowErrors() throws -> String {
    return "q";
}
do {
    try canThrowErrors();
} catch {
    // some code
}

```

`try?`将错误转换成可选值:

```swift
func canThrowErrors() throws -> String {
    return "q";
}
if let v = try? canThrowErrors() {
    // some code
} else {
    // some code
}
```

`try!`断言函数执行不会抛出错误, 如果真的有错误, 会产生运行时错误, 导致程序中止:

```swift
func canThrowErrors() throws -> String {
    return "q";
}
try! canThrowErrors();
```

## 断言和先决条件

断言只在调试环境生效, 先决条件在生产环境也生效. 如果不满足条件, 会产生运行时错误, 导致程序中止.

```swift
assert(age >= 0);
precondition(index > 0);
```

## 对比: 字符串 数组 集合 字典

字符串:

```swift
// 创建
var a = "qqqqwwww!";

// 增
a.insert("!", at: a.endIndex);
a.insert(contentsOf: "!!", at: a.endIndex);
a += "vw";
// 删
a.remove(at: a.startIndex);
a.removeSubrange(a.startIndex..<a.endIndex);
a.removeFirst();
a.removeLast();

// 改
a.replaceSubrange(a.startIndex..<a.endIndex, with: "!!!");

// 查
a[a.index(before: a.endIndex)];
a[a.index(after: a.startIndex)];
a[a.index(a.startIndex, offsetBy: 3)];
a.count;
a.isEmpty;
a.prefix(2);
a.suffix(2);

// 遍历
for v in string {};
for i in string.indices {};
```

数组:

```swift
// 创建
var a: [Int] = [];
var a = [Int](repeating: "vvv", count: 3);

// 增
a.insert("v", at: 0);
a.insert(contentsOf: ["v", "w"], at: 0);
a.append("v");
a += ["v", "w"];

// 删
a.remove(0);
a.removeSubrange(0..<a.count);
a.removeFirst();
a.removeLast();

// 改
a[4] = "v";
a[4...6] = ["v", "v"];

// 查
a[4];
a.count;
a.isEmpty;

// 遍历
for v in a {
}
for (i, v) in a.enumerated() {
}
```

集合:

```swift
// 创建
var a : Set<Int> = [1, 2, 3];

// 增
a.insert(4);
// 删
a.remove(4); // 返回被移除的值或者nil
// 查
a.count;
a.isEmpty;

// 遍历
for v in a {
}
for v in a.sorted() {
}
```

字典的创建, 属性, 方法, 遍历:

```swift
// 创建
var a: [String: String] = [:];
var a: [String: String] = ["q": "w", "e": "r"];

// 增 or 改
a["q"] = "v";
a.updateValue("v", forKey: "q"); // 返回原值或者nil

// 删
a.removeValue("v"); // 返回原值或者nil

// 查
a["q"];
a.count;
a.isEmpty;

// 遍历
for (i, v) in a {
}
for i in a.keys {
}
for v in a.values {
}
let keys = [String](a.keys);
let values = [String](a.values);
```

## 其他字符串信息

多行字符串:

> * 开启"""后的换行符, 和关闭"""前的换行符, 是不包括在多行字符串内容内的
> * 如不希望换行符被包括在字符串内容中, 可以在行尾使用\
> * 关闭"""之前的空白字符, 表明其他各行多少空白字符串需要忽略

```swift
let quotation = """
The White Rabbit put on his spectacles.  "Where shall I begin,\
please your Majesty?" he asked.

"Begin at the beginning," the King said gravely, "and go on\
till you come to the end; then stop."

""";
```

扩展分隔符, 里面的转义字符, 除了\#都没特殊效果 (感觉对写正则很有帮助):

```swift
print(#"\n\n\n\n\n"#); // 不会输出换行, 会输出\n字面量

print(#"\n\n\#n\n\n"#); // 真想换行, 使用\#n

print(##""#"##); // 我就想输出"#, 可以使用2个#包裹 (离谱...)

print(#"""
\n\n\n\
"""#); // 可用于多行字符串, 此时\也是失效的, 想生效用\# (复杂不...)
```

字符串插值

```swift
let a = "hello \(b)";
```

## 集合的基本操作

```swift
a.intersection(b); // 创建a和b的交集
a.union(b); // 创建a和b的并集
a.symmetricDifference(b); // 创建a和b的对称差(各自不相交的部分)
a.subtracting(b); // 创建只存在于a不存在于b的集合

a == b;// 检查a集合和b集合的值是否完全相等
a.isSubset(of: b); // 检查a是否为b的子集
a.isSuperset(of: b); // 检查a是否为b的父集
a.isDisjoint(with: b); // 检查a和b是否无交集
```

## 控制流

for-in中, 每次增加一定的值遍历:

```swift
for tickMark in stride(from: from, to: to, by: by) { // from到to, 每by, 不包含to
}
for tickMark in stride(from: from, through: through, by: by) { // from到through, 每by, 包含through
}
```

repeat-while:

```swift
repeat {} while condition;
```

switch-case (Swift的这一语句相当灵活):

> * Swift的case不用写`break`, 相反, 如果希望代码继续往下执行, 需要使用`fallthrough`

```swift
switch v {
    case 1, 2:
        statement;
    case 3...5:
        statement;
        fallthrough;
    default:
        statement;
}

switch v {
    case ("v", 1):
        statement;
    case ("v", 2...5):
        statement;
    case ("v", let n):
        print(n);
    case let (v, n):
        print(v, n);
}

switch v {
    case (let v, 0), (0, let v):
        statement; // v的类型必须一致, 代表匹配到的值
    case (let x, let y) where x == y:
        statement;
}
```

break和continue之后可以指定标签, 表明要控制哪个循环体或者条件语句:

```swift
whileLoop: while {
    switch a {
        case 1:
            break whileLoop;
        default:
            break;
    }
}
```

guard语句 (相对于if语句, 在进行"非"判断时更简洁):

```swift
guard let a else {
    statement;
}
```

可用性检查. 如果使用的api在目标平台上不支持, 就会编译报错, 可以通过以下的写法控制不同平台的api调用:

```swift
if #available(iOS 10, macOS 10.12, *) {
}  else {
}
```

## 类型转换

使用类型检查操作符`is`检查一个父类实例是否属于某个子类:

```swift
if someSuperInstance is SubClass {
    // xxx
}
```

使用类型转换操作符`as`将父类实例转换为子类实例:

```swift
if let someSubInstance = someSuperInstance as? SubClass {
    // 如果转换失败, as?返回nil
}
let someSubInstance = someSuperInstance as! SubClass // 如果转换失败, as!抛出运行时错误
```

`Any`表示任意类型, 包括函数类型; `AnyObject`表示任何类的实例, 下面是switch语句解析Any类型的数据:

```swift
let thing = xxx as Any
switch thing {
    case 0 as Int:
    // xxx
    case let someInt as Int:
    // xxx
    case let someFunc as (String) -> String:
    // xxx
    case is Bool:
    // xxx
}
```

