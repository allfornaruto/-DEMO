// js代码转AST
const parser = require("@babel/parser");
//从AST中找到相应的节点
const traverse = require("@babel/traverse").default;
//提供了很多和 AST 的 Node 节点相关的辅助函数
const t = require("@babel/types");
//将 AST 树重新转为对应的代码字符串
const generate = require("babel-generator").default;
const template = require("@babel/template").default;

module.exports = function (source) {
  let ast = parser.parse(source, {
    sourceType: "module",
    plugins: ["dynamicImport"]
  });
  traverse(ast, {
    VariableDeclaration(path) {
      if(path.node.declarations[0].id.name === "addResult"){
        const ast = template.statements(`
          console.log("addResult=",addResult);
          `)();
          path.insertAfter(ast);
      }
    },
  });
  return generate(ast).code;
};