let path = require("path");
let express = require("express");
let cors = require("cors");
let { createProxyMiddleware } = require("http-proxy-middleware");
let fsMock = require("./src/fs-mock.js");

function init(app, config) {
  app.get("/", (req, res) => {
    res.send("Mock Service!");
  });

  let proxy = config.proxy || {};
  let filter = function (pathname, req) {
    let mockApiPath = fsMock.generateApiPath(config.mock);

    if (mockApiPath.includes(fsMock.generateApi(req.method, pathname))) {
      return false;
    }
    if (pathname === "/") return false;

    return true;
  };

  for (let key in proxy) {
    if (Object.hasOwnProperty.call(proxy, key)) {
      app.use(key, createProxyMiddleware(filter, proxy[key]));
    }
  }

  app.all("*", function (req, res) {
    let mockFileName = fsMock.generateApi(req.method, req.path);

    try {
      let mockFilePath = path.join(config.mock, `./${mockFileName}.js`);

      delete require.cache[mockFilePath];

      let data = require(mockFilePath);

      res.status(data.httpStatus || 200).send(data.response);
    } catch (error) {
      console.log(error);
      res.send("response exception");
    }
  });
}

module.exports = {
  start: function (config) {
    if (!config) {
      throw new Error("must contain the confing parameter");
    }
    if (!config.mock || !config.port || !config.proxy) {
      throw new Error("wrong parameter");
    }

    let app = express();

    app.use(cors());
    init(app, config);

    app.listen(config.port, () => {
      console.log(`mock service listening on port ${config.port}`);
    });
  },
};
