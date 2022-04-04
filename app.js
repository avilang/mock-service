let express = require("express");
let cors = require("cors");
let { createProxyMiddleware } = require("http-proxy-middleware");
let config = require("./config.local.json");
let app = express();
let port = config.port;
let proxy = config.proxy || {};
let filter = function (pathname, req) {
  if (pathname === "/") return false;
  return true;
};

app.use(cors());

for (let key in proxy) {
  if (Object.hasOwnProperty.call(proxy, key)) {
    app.use(key, createProxyMiddleware(filter, proxy[key]));
  }
}

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.all("*", function (req, res) {
  res.send("no proxy");
});

app.listen(port, () => {
  console.log(`mock service listening on port ${port}`);
});
