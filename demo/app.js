let path = require("path");
let mockService = require("@avilang/mock-service");

mockService.start({
  port: 9009,
  mock: path.join(__dirname, "./"),
  proxy: {
    "/web/*": {
      target: "http://localhost:8080",
    },
    "/apis/*": {
      target: "http://dev.domain.com",
      changeOrigin: true,
    },
  },
});
