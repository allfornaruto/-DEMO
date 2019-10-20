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
    Identifier(path) {
      if(t.isIdentifier(path.node, { name: "a" })){
        path.parent.value.value=100;
      }
      else if(t.isIdentifier(path.node, { name: "b" })){
        path.parent.value.value=200;
      }
      // if (isIwant_replaceElement(path)) {
      //   const parent = path.findParent(path => path.isAssignmentExpression());
      //   const rightFunctionExpression = parent.get("right");
      //   const functionBody = rightFunctionExpression.get("body").get("body");
      //   const ast = template.statements(`
      //     if(window.vm){
      //       var vm=window.vm.$children[0];
      //       vm.$set(vm.bpmnPanel,'replaceElement',replaceElement);
      //     }
      //     window.bpmnPanel.replaceElement = replaceElement;
      //   `)();
      //   functionBody[2].insertBefore(ast);
      // }
    },
  });
  return generate(ast).code;
};