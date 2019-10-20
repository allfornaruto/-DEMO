const fs = require("fs");
const path = require("path");
const config = require("./config");

const soureceRootName = config.soureceRootName;

const filePath = config.filePath;

//源码的绝对路径
const sourceRootDir = path.resolve(__dirname, "../",soureceRootName);
//获取 准备修改的源码文件相对于sourceRootDir的相对路径
const getRelativeSourceFilePath=function(filePath) {
  return path.join(__dirname, "../", soureceRootName,filePath);
};
//获取 修改脚本相对于transform文件夹的相对路径
const getRelativeFilePath=function(filePath) {
  return path.join(__dirname, "./", 'transform',filePath);
};

//需要修改的源码文件的绝对路径
const targetFilePath = filePath.map((p)=>getRelativeSourceFilePath(p));
//源代码文件（绝对路径）与修改脚本（绝对路径）之间的映射
const transformScriptPathMap = new Map(filePath.map((p)=>[getRelativeSourceFilePath(p),getRelativeFilePath(p)]));

function recursiveDir(filePath) {
  //根据文件路径读取文件，返回文件列表
  fs.readdir(filePath, function (err, files) {
    if (err) {
      console.warn(err);
    } else {
      //遍历读取到的文件列表
      files.forEach(function (filename) {
        //获取当前文件的绝对路径
        var filedir = path.join(filePath, filename);
        //根据文件路径获取文件信息，返回一个fs.Stats对象
        fs.stat(filedir, function (eror, stats) {
          if (eror) {
            console.warn("获取文件stats失败");
          } else {
            let isFile = stats.isFile();//是文件
            let isDir = stats.isDirectory();//是文件夹
            let isTargetFile = targetFilePath.includes(filedir);//是目标文件
            if (isFile && isTargetFile) {
              fs.readFile(filedir, "utf8", function (err, data) {
                if (err) throw err;
                const newContent = require(transformScriptPathMap.get(filedir))(data);
                fs.writeFile(filedir, newContent, "utf8", (err) => {
                  if (err) throw err;
                  console.log(`${filedir} transform done`);
                });
              });
            }
            if (isDir) {
              recursiveDir(filedir);
            }
          }
        });
      });
    }
  });
}

recursiveDir(sourceRootDir);



