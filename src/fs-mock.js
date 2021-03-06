let fs = require("fs");

function generateApiPath(dir) {
  let output = [];

  try {
    let files = fs.readdirSync(dir, {
      encoding: "utf8",
      withFileTypes: true,
    });
    output = files
      .filter((dirent) => {
        return (
          dirent.isFile() &&
          /.+\.js$/.test(dirent.name) &&
          /^(get|patch|post|put|delete)_.+/.test(dirent.name)
        );
      })
      .map((dirent) => {
        return dirent.name.replace(/(.+)\.js$/, "$1");
      });
  } catch (err) {}

  return output;
}

function generateApi(method, url) {
  let api = [
    `${method}`.toLowerCase(),
    ...url.split("/").filter((uri) => {
      return !!uri;
    }),
  ];

  return api.join("_");
}

module.exports = {
  generateApiPath,
  generateApi,
};
