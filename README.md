# mock service

简陋的 mock 服务，暂时只用于 node 端。为了方便的调用后台接口或本地 Mock 数据而创建，方便本地开发调试。  

![mock-service](https://raw.githubusercontent.com/avilang/mock-service/main/mock-service.png)

## 安装

`npm i @avilang/mock-service`

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
