const path = require('path');
const config = require("../src/config");
const soureceRootName = config.soureceRootName;

//源码的绝对路径
const sourceRootDir = path.join(process.cwd(),soureceRootName);

//transform文件夹的绝对路径
const transformDir = path.join(process.cwd(),'src','transform');

//获取 准备修改的源码文件相对于sourceRootDir的相对路径
const getRelativeSourceFilePath=function(filePath) {
  return path.join(sourceRootDir,filePath);
};

//获取 修改脚本相对于transform文件夹的相对路径
const getRelativeFilePath=function(filePath) {
  return path.join(transformDir,filePath);
};

//代码格式化
const iGetInnerText = function(testStr) {
  let resultStr = testStr.replace(/\ +/g, ""); //去掉空格
  resultStr = resultStr.replace(/[ ]/g, "");    //去掉空格
  resultStr = resultStr.replace(/[\r\n]/g, ""); //去掉回车换行
  let temp = "";
  let splitstring = resultStr.split(" ");
  for(i = 0; i < splitstring.length; i++)
    temp += splitstring[i];
  return temp;
};

module.exports={
  iGetInnerText,
  getRelativeSourceFilePath,
  getRelativeFilePath
};