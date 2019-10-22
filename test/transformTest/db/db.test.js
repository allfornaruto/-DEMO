const fs = require('fs');
const Utils = require("../../utils");

const relativePath = "db/db.js";

test('db/db.js transform success', async(done) => {
  const correct = `
  function savedb(){
var data = {};
var ood = new aliyun();
return ood.addOrUpdate(data);
}`;
  const sourcePath = Utils.getRelativeSourceFilePath(relativePath);
  const transformPath = Utils.getRelativeFilePath(relativePath);
  fs.readFile(sourcePath, "utf8", function(err, data) {
    if (err) throw err;
    const transformContent = require(transformPath)(data);
    const innerTransformContent = Utils.iGetInnerText(transformContent);
    const innerCorrect = Utils.iGetInnerText(correct);
    expect(innerTransformContent).toBe(innerCorrect);
    done()
  });
});