// js代码转AST
const parser = require("@babel/parser");
//从AST中找到相应的节点
const traverse = require("@babel/traverse").default;
//提供了很多和 AST 的 Node 节点相关的辅助函数
const t = require("@babel/types");
//将 AST 树重新转为对应的代码字符串
const generate = require("babel-generator").default;
const template = require("@babel/template").default;

module.exports = function(source) {
  let ast = parser.parse(source, {
    sourceType: "module",
    plugins: ["dynamicImport"]
  });
  traverse(ast, {
    FunctionDeclaration(path) {
      if (t.isIdentifier(path.node.id, { name: "savedb" })) {
        const blockStatements = path.node.body.body;
        // var s3 = new s3(); -> var ood = new aliyun();
        const s3toaliyun = blockStatements.filter((item) => {
          let isVariableDeclaration = t.isVariableDeclaration(item);
          let isTargetIdentifier = isVariableDeclaration && t.isIdentifier(item.declarations[0].id, { name: "s3" });
          return isTargetIdentifier;
        });
        s3toaliyun[0].declarations[0].id.name = "ood";
        s3toaliyun[0].declarations[0].init.callee.name = "aliyun";
        // return s3.save(data); -> return ood.addOrUpdate(data);
        const save2addOrUpdate = blockStatements.filter((item) => {
          let isReturnStatement = t.isReturnStatement(item);
          return isReturnStatement;
        });
        save2addOrUpdate[0].argument.callee.object.name = "ood";
        save2addOrUpdate[0].argument.callee.property.name = "addOrUpdate";
      }
    }
  });
  return generate(ast).code;
};