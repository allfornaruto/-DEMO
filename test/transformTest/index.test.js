const fs = require('fs');
const Utils = require("../utils");

const relativePath = "index.js";

test('index.js transform success', async (done) => {
  const correct=`
  const Number = require('./utils/Number');
  const params = require('./config');
  
  const addResult = Number.add(params.a , params.b);

  console.log("addResult=",addResult);
`;
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