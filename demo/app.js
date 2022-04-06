let path = require("path");
let mockService = require("../index.js");

mockService.start({
  port: 9009,
  mock: path.join(__dirname, "./"),
  proxy: {
    "/lots-web/*": {
      target: "http://localhost:8080",
    },
    "/apis/*": {
      target: "http://kf.abc.cn",
      changeOrigin: true,
    },
  },
});
