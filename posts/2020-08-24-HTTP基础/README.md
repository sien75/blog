<h1>HTTP基础</h1>

本文为阅读[MDN文档中的HTTP部分](https://developer.mozilla.org/zh-CN/docs/Web/HTTP)以及其他相关资料的笔记, 记录下了我认为关于HTTP的有价值的基础内容, 仅作为参考, 并不是教程类文章.

<!--more-->

## HTTP缓存

*本文参考了<https://www.cnblogs.com/chenqf/p/6386163.html>, 这篇文章写的非常棒!*

1. 缓存分为**强制缓存**和**对比缓存**.
    - 强制缓存如果生效, 那么就不需要向服务器发送请求, 直接使用缓存内容
    - 对比缓存机制下总是会向服务器发送请求, 服务器会进行验证, 并决定返回内容
    - 强制缓存优先级高于对比缓存, 强制缓存不生效时再使用对比缓存规则
  
2. `强制缓存`是通过时间来验证缓存内容是否过期的. HTTP1.0时期的`Expires`字段, 已被HTTP1.1时期的`Cache-Control`替代. 在第一次请求服务器时, 服务器响应头会通过`Cache-Control`来告知客户端缓存策略. `Cache-Control`字段主要有以下取值:
    - max-age=n, 表示采用强制缓存, 且有效时间为n秒
    - no-cache, 使用对比缓存
    - no-store, 不缓存

3. `对比缓存`有以下两种方式来验证缓存内容是否过期:
    - `If-Modified-Since`, 客户端在请求头中带上上一次在服务器返回内容时`Last-Modified`的字段内容, 服务器验证在此时间之后内容是否有修改, 如有则返回新内容(200 OK), 如无则返回304 Not Modified
    - `If-None-Match`, 客户端在请求头中带上上一次服务器返回内容时`Etag`的字段内容, 这是由服务器生成的对资源的唯一标识, 服务器使用这一标识验证相应内容是否有新版本, 如有则返回新内容(200 OK), 如无则返回304 Not Modified

4. 总的来说, 优先级上`强制缓存` > `If-None-Match/Etag` > `If-Modified-Since/Last-Modified`.
    - 如果存在强制缓存设置且生效, 则直接在缓存中获得内容, 不向服务器发送请求
    - 如果强制缓存未设置或失效, 则使用对比缓存, 上一次服务器返回的HTTP头中若有`Etag`字段则用`If-None-Match/Etag`, 否则若有`Last-Modified`则用`If-Modified-Since/Last-Modified`
    - 如果未设置缓存机制, 则正常请求服务器内容

## HTTP Cookie

Cookie主要用于会话管理, 个性化设置和浏览器行为跟踪, 由于Cookie有大小限制, 且浏览器每次请求都会带上Cookie数据造成额外开销, 所以Cookie已经不适合用作存储数据.

服务端设置Cookie:
```
Set-Cookie: id=a3fWa; Expires=Wed, 21 Oct 2015 07:28:00 GMT; Secure; HttpOnly; Domain=baidu.com; Path=/search; SameSite=None
```
其中:
- 未指定过期时间`Expires`则为会话Cookie, 窗口关闭自动删除; 设置了`Expires`是按照客户端的时间来计算的
- `Secure`标识是指该Cookie仅能在HTTPS请求中发送给服务端
- `HttpOnly`标识是指该Cookie无法通过`document.cookie`访问到, 可有效防止XSS攻击
- `Domain`标识指定后所有子域名都可以使用这一Cookie, 默认情况下不同子域名间是不能互相访问Cookie的
- `Path`标识设置后所有`/search`目录下的所有路径都会访问到Cookie值
- `SameSite=Lax`为浏览器默认值, 意思是跨域请求不带上该Cookie, 可有效防止CSRF攻击, 设为`None`则取消该限制

## CORS

CORS(Cross-Origin Resource Sharing)跨域资源共享, 是一种机制, 使用额外的HTTP头来告诉浏览器和服务器, 控制跨域的HTTP请求.

1. 场景1: 简单请求. 所谓简单请求, 是指使用`GET` `POST` `HEAD`, 且只包含被允许的HTTP头, `Content-Type`只能是指定值的请求. 浏览器在请求时会带上如下HTTP头:
    ```
    Origin: https://source.com
    ```
    服务器核实这个域是否被允许, 如允许, 则返回内容中带有如下HTTP头:
    ```
    Access-Control-Allow-Origin: *(或https://source.com)
    ```
    如果不允许, 返回内容中是不包含这个HTTP头的, 并在浏览器中触发错误.

2. 场景2: 复杂请求. 不满足简单请求的都是复杂请求, 浏览器会预先使用OPTION方法发送一个预检请求, 询问服务器是否允许:
    ```
    Origin: https://source.com
    Access-Control-Request_method: PUT
    Access-Control-Headers: My-Header
    ```
    如果服务器允许, 就会带上以下HTTP头:
    ```
    Access-Control-Allow-Origin: http://source.com
    Access-Control-Allow-Methods: POST, GET, OPTIONS, PUT
    Access-Control-Allow-Headers: My-Header
    Access-Control-Max-Age: 86400
    ```
    其中`Access-Control-Max-Age: 86400`意思是在24小时之内不必为同样的请求再次发送预检请求.

3. 场景3: 附带Cookie的请求. 当然, 要想跨域附带Cookie, 首先需要设置好`目标网站https://destination.com`Cookie的`SameSite: None`, 允许跨域请求带Cookie. 对于XHR请求来说, 附带Cookie的操作如下:
    ```js
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.withCredentials = true;
    //other codes
    ```
    这样请求中就会带上Cookie, 如果服务器允许, 则返回的请求中就会多出如下HTTP头:
    ```
    Access-Control-Allow-Credentials: true
    ```

## 常见的HTTP响应代码

- `200 OK`, 请求成功
- `301 Moved Permanently`, 请求的资源已被永久移至新位置
- `304 Not Modified`, 请求的资源没有更改
- `404 Not Found`, 请求的资源未发现
- `501 Not Implemented`, 服务器不支持此请求方法