const fs = require('fs');
const Utils = require("../../utils");

const relativePath = "config/index.js";

test('config/index.js transform success', async (done) => {
  const correct=`
  module.exports = {
      a: 100,
      b: 200
  };`;
  const sourcePath = Utils.getRelativeSourceFilePath(relativePath);
  const transformPath = Utils.getRelativeFilePath(relativePath);
  fs.readFile(sourcePath, "utf8", function (err, data) {
    if (err) throw err;
    const transformContent = require(transformPath)(data);
    const innerTransformContent = Utils.iGetInnerText(transformContent);
    const innerCorrect = Utils.iGetInnerText(correct);
    expect(innerTransformContent).toBe(innerCorrect);
    done()
  });
});