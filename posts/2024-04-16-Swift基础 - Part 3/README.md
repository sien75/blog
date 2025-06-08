<h1>Swift基础 - Part 3</h1>

以自己已经掌握的TypeScript语言, 和部分掌握的C语言出发, 记录一些针对Swift语言的不同之处.

## 结构体, 枚举和类

类是引用类型, 枚举和结构体(和大多数类型)都是值类型:

> 重载了==运算符时, 类的实例可以使用===确定是否指向同一地址

```swift
struct A {
    var v: Int;
}

let a = A(v: 1);
a.v = 2; // 会报错, 因为a是常量值类型, 不能修改

var b = a;
b.v = 3; // a的值不会被修改, 因为a->b是值拷贝
```

存储属性和计算属性:

> 枚举并不支持常规的存储属性

```swift
import Foundation
struct Square {
    var width: Double = 10.0;
    var area: Double {
        get {
            pow(width, 2.0)
        }
        set {
            width = sqrt(newValue)
        }
    }
    var perimeter: Double {
        width * 4
    }
}
```

属性观察器:

```swift
class StepCounter {
    var totalSteps: Int = 0 {
        willSet {
            print("将 totalSteps 的值设置为 \(newValue)")
        }
        didSet {
            if totalSteps > oldValue  {
                print("增加了 \(totalSteps - oldValue) 步")
            }
        }
    }
}
let stepCounter = StepCounter()
stepCounter.totalSteps = 200
```

属性包装器:

```swift
@propertyWrapper
struct SmallNumber {
    private var maximum: Int
    private var number: Int

    var wrappedValue: Int {
        get { return number }
        set { number = min(newValue, maximum) }
    }

    init() {
        maximum = 12
        number = 0
    }
    init(wrappedValue: Int, maximum: Int) {
        self.maximum = maximum
        number = min(wrappedValue, maximum)
    }
}

struct SomeNumber {
    @SmallNumber var a: Int;
    @SmallNumber(wrappedValue: 20, maximum: 30) var b: Int;
    @SmallNumber(maximum: 30) var c: Int = 50;
}
```

延时加载属性:

> 顺便提一下, 全局变量默认是延时加载的, 全局变量也可以使用计算属性和属性观察器, 但是不能使用属性包装器

```swift
class A {
    lazy var b = B() // 必须声明为var
    var c = C()
}

a = A()
a.c // 此时还未初始化b
a.b // 访问时初始化
```

下标:

```swift
struct A {
    v = ["a", "b", "c", "d"]
    subscript(index: Int) -> String { // 入参和出参可以是任意类型
        get {
            v[index]
        }
        set {
            v[index] = newValue
        }
    }
}

let a = A()
a[1] // b

struct A {
    v = ["a", "b", "c", "d"]
    subscript(row: Int, column: Int) -> String { // 入参和出参可以是任意类型
        get {
            v[row * 2 + column]
        }
        set {
            v[row * 2 + column] = newValue
        }
    }
}

let a = A()
a[0,1] // b
```

(仅结构体)如果方法对结构体内的属性进行了修改, 需要添加`mutating`关键字:

```swift
struct A {
    var value = 1;
    mutating func increase() {
        value += 1;
    }
    mutating func setTo(newValue: Int) {
        self = A(value: newValue);
    }
}
```

## 枚举

> 仅枚举支持的部分

可以将枚举值放在一行:

```swift
enum Planet {
	case mercury, venus, earth, mars, jupiter, saturn, uranus, neptune
}
```

枚举值的点语法:

```swift
var planet = Planet.venus;
planet = .mars;

switch planet {
case .earth:
    // some code
default:
    // some code
}
```

枚举值的所有值的集合:

```swift
Planet.allCases;
```

switch和枚举值的结合使用:

```swift
enum A {
    case u(p: Int)
    case v(p: String)
}

var a = A.u(p: 8);

switch a {
case .u(let p):
    // some code
case .v(p: "qwe"):
    // some code
case .v(let p):
    // some code
}
```

## 类

继承, 子类重写父类的属性和方法:

```swift
class Base {
    var a = 1;
    var b = 2;
    func f() -> Int {
        a + b;
    }
    final var d = "cannot override"; // 如果final修饰class, 意味着class不能被继承
}
class Extended: Base {
    override var a: Int {
        get {
            super.a
        }
        set {
            super.a = newValue
        }
    }
    override var b: Int {
        didSet {
            print("didSet \(oldValue)");
        }
    }
    override func f() -> Int {
        a + b;
    }
}
```

## 构造和析构过程

详情查看<https://gitbook.swiftgg.team/swift/swift-jiao-cheng/14_initialization#class-inheritance-and-initialization>

指定构造器和便利构造器的规则:

* 指定构造器必须调用其直接父类的的指定构造器
* 便利构造器必须调用同类中定义的其它构造器
* 便利构造器最后必须调用指定构造器

两端式构造过程:

* 先自下向顶, 再自顶向下
  * 子类实例需确保自己声明的所有存储属性初始化, 然后再调用`super.init`
  * 调用`super.init`之前, 无法调用函数
  * 调用`super.init`之后, 可以针对自己声明的存储属性和继承来的存储属性进行二次处理

继承和重写:

* 继承重写时必须标明`override`修饰符
* 子类的指定构造器或便利构造器可以重写父类的指定构造器, 无法重写父类的便利构造器
* 自动继承
  * 如果子类没有定义任何指定构造器, 它将自动继承父类所有的指定构造器
  * 如果子类提供了所有父类指定构造器的实现——无论是通过规则1继承过来的，还是提供了自定义实现——它将自动继承父类所有的便利构造器, 即使你在子类中添加了更多的便利构造器

可失败构造器:

* 结构体, 枚举和类都可以声明可失败构造器`init?`, 并在函数内通过`return nil`的方式终止构造过程
* 子类可以使用不可失败构造器或可失败可失败构造器重写父类的可失败构造器, 但是不可以使用可失败构造器重写不可失败构造器

必要构造器:

* 父类中声明`required`的构造器, 子类必须实现重写

析构函数:

* `deinit`析构函数在类的实例被释放之前调用

