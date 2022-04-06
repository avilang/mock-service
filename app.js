let path = require("path");
let express = require("express");
let cors = require("cors");
let { createProxyMiddleware } = require("http-proxy-middleware");
let config = require("./config.local.json");
let fsMock = require("./src/fs-mock.js");
let app = express();
let port = config.port;
let proxy = config.proxy || {};
let project = config.project;

if (!project) {
  throw new Error("project directory must be included");
}

app.use(cors());

let filter = function (pathname, req) {
  let mockApiPath = fsMock.generateApiPath(project);

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

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.all("*", function (req, res) {
  let mockFileName = fsMock.generateApi(req.method, req.path);

  try {
    let mockFilePath = path.join(
      __dirname,
      "./project",
      `./${project}`,
      `./${mockFileName}.js`
    );

    delete require.cache[mockFilePath];

    let data = require(mockFilePath);

    res.status(data.httpStatus || 200).send(data.response);
  } catch (error) {
    console.log(error);
    res.send("response exception");
  }
});

app.listen(port, () => {
  console.log(`mock service listening on port ${port}`);
});
