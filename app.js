let express = require("express");
let config = (function () {
  try {
    return require("./config.local.json");
  } catch (error) {
    return { port: 9009 };
  }
})();
let app = express();
let port = config.port;

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`mock service listening on port ${port}`);
});
