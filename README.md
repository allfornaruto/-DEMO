# 版本合并解决方案DEMO

## 该DEMO演示了什么？

>代码版本更新时，我们实现一个自动化工具，减轻代码合并的工作量

## 需求介绍

>我们对源码有以下几个需求：
+ 我们希望能在计算出结果后，把结果打印出来(新增代码) console.log(...)
+ 我们需要修改参数(修改源码) a->100,b->200

## 解决方案

>我们的代码在源代码外部进行编写，通过脚本的形式去修改源代码
>>
>修改源码文件的脚本只需要三个参数
1. 文件路径
2. 代码注入的位置
3. 我们自己的代码

### 优点
1. 我们自己的代码绝对不会被覆盖
2. 只需要执行一行命令即可自动化的注入我们自己的代码
3. 有测试用例保证代码合并的正确性
4. 源码结构发生小规模的调整时，我们只需要调整代码注入的位置即可

### 缺点
1. 编写寻找代码注入的函数以及测试用例会带来一定的工作量
2. 需要学习Babel和AST，有一定的学习成本
3. 遇到源码结构大规模调整时，同样需要大量修改代码。

### 201910版本 

```

201910
    |--config
    |       |--index.js         //提供参数a:1 b:2
    |
    |-----db
    |       |--db.js            //模拟aws数据库存储
    |
    |--utils
    |       |--Number.js        //提供了add函数
    |
    |--index.js                 //调用函数进行求值

```

## 201911版本

```

201910
    |--config
    |       |--index.js         //修改了参数a:10 b:20
    |
    |-----db
    |       |--db.js            //模拟aws数据库存储
    |
    |--utils
    |       |--Number.js        //新增minus函数、multiply函数、divide函数
    |
    |--index.js                 //调用函数进行求值

```

#### 使用方法

```
    npm install 安装项目依赖
    npm run test 测试transform脚本
    npm run transform 测试通过则开始转换源代码，执行完观察源码的变化
```

>transform脚本是针对源码201910版本的，假设新的源码是201911版本，则修改src/config.js的soureceRootName为201911。因为201911的代码有部分变动，我们需要去修改我们的测试用例和transform脚本去适配201911新源码。修改方法如下

```javascript
  // old src/transform/index.js
  VariableDeclaration(path) {
        if(path.node.declarations[0].id.name === "addResult"){
          const ast = template.statements(`
            console.log("addResult=",addResult);
            `)();
            path.insertAfter(ast);
        }
      }
 // new src/transform/index.js
 VariableDeclaration(path) {
       if(path.node.declarations[0].id.name === "divideResult"){
         const ast = template.statements(`
           console.log("addResult=",addResult);
           console.log("minusResult=",minusResult);
           console.log("multiplyResult=",multiplyResult);
           console.log("divideResult=",divideResult);
           `)();
           path.insertAfter(ast);
       }
     }
  // old src/transform/db/db.js
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
  // new src/transform/db/db.js
  FunctionDeclaration(path) {
      if (t.isIdentifier(path.node.id, { name: "savedbv2" })) {
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
```

```javascript
// old test/transformTest/index.test.js
const correct=`
  const Number = require('./utils/Number');
  const params = require('./config');

  const addResult = Number.add(params.a, params.b);
  console.log("addResult=", addResult);
`;
// new test/transformTest/index.test.js
const correct=`
  const Number = require('./utils/Number');
  const params = require('./config');
  
  const addResult = Number.add(params.a , params.b);
  const minusResult = Number.minus(params.a , params.b);
  const multiplyResult = Number.multiply(params.a , params.b);
  const divideResult = Number.divide(params.a , params.b);

  console.log("addResult=",addResult);
  console.log("minusResult=",minusResult);
  console.log("multiplyResult=",multiplyResult);
  console.log("divideResult=",divideResult);
`;
// old test/transformTest/db/db.test.js
const correct = `
  function savedb(){
var data = {};
var ood = new aliyun();
return ood.addOrUpdate(data);
}`;
// new test/transformTest/db/db.test.js
const correct = `
  function savedbv2(){
var data = {};
var o = {};
data.o = o;
var ood = new aliyun();
return ood.addOrUpdate(data);
}`;
```

#### 补充资料

[网站：在线代码转换成AST](https://astexplorer.net)

[Babel插件手册：中文版](https://github.com/jamiebuilds/babel-handbook/blob/master/translations/zh-Hans/plugin-handbook.md)
