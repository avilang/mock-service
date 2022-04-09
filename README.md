# mock service

简陋的 mock 服务，暂时只用于 node 端。为了方便的调用后台接口或本地 Mock 数据而创建，方便本地开发调试。

![mock-service](https://raw.githubusercontent.com/avilang/mock-service/main/mock-service.png)

## 安装

`npm i @avilang/mock-service`  
`yarn add @avilang/mock-service`

## 使用

```js
let path = require("path");
let mockService = require("@avilang/mock-service");

mockService.start({
  // mock 服务端口
  port: 9009,
  // mock 文件存放目录(绝对路径)
  mock: path.join(__dirname, "./"),
  // http-proxy options 见 https://github.com/chimurai/http-proxy-middleware#http-proxy-options
  proxy: {
    "/lots-web/*": {
      target: "http://localhost:8080",
    },
    "/apis/*": {
      target: "http://dev.abc.cn",
      changeOrigin: true,
    },
  },
});
```

### mock 文件规则

响应数据优先返回本地 mock 数据，若没有寻找到本地 mock 文件时，则返回接口数据  
例: 请求方法是 `POST` 链接为 `/order/code`，则对应的 mock 文件为 `post_order_code.js`  
即: `请求方法(英文小写)` + `_` + `请求 URl(分割符号替换成 "_")`

mock 文件示例:

```js
module.exports = {
  // http status code（可不填，则默认为 200）
  httpStatus: 200,
  // 响应内容
  response: {
    code: 2000,
    list: [...]
  }
}
```

也可以配合如 [Mock](https://github.com/nuysoft/Mock) 等库，构造数据。

### 建议在项目中启用一个 mock 服务来使用，并提交到代码仓库

如以下目录结构

```
root
├── mock(mock 服务目录)
└── app(应用目录)
```
