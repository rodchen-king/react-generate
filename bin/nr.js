#! /usr/bin/env node

var program = require('commander')
var fs = require("fs");

program 
  .version('0.0.2') 
  .arguments('<cmd>')
  .option('--component', 'start server') 
  .option('--route', 'restart server') 
  .action(function (cmd, env) {
    name = cmd;
});


program.parse(process.argv)

var localPath = process.cwd();

// 创建组件
if (program.component) {
  // 判断字符串是否为首字母大写
  var supperExec = /^[A-Z]/

  if (!supperExec.test(name)) {
    console.error("请输入首字母为大写的组件名称");
    return;
  }

  var pathArray = name.split('/')
  
  console.log(pathArray.length)

  if (pathArray.length == 1) {
    localPath = `${localPath}/${pathArray[0]}`
  } else {
    var folderPath = `${localPath}/${pathArray[0]}`
    localPath = `${localPath}/${pathArray[0]}/${pathArray[1]}`
    fs.mkdir(folderPath, function(err){
      if(err){
          console.log('创建文件夹出错！');
      }
      console.log('创建文件夹成功！');
    });
  }


  // fs.stat(localPath, function (err, stats) {
  //   //检验是否为文件
  //      if(stats.isFile()){
  //          main(`${localPath}.js`, './component/Basic.js');    
  //          main(`${localPath}.less`, './component/Basic.less');    
  //      }else{
  //         deleteFolder(localPath)
  //         main(localPath); 
  //      }
  //  });

  fs.open(`${localPath}.js`, "w",function (err) {

  });
  fs.open(`${localPath}.less`, "w",function (err) {

  });
  
  // deleteFolder(`${localPath}.js`)
  // deleteFolder(`${localPath}.less`)

  main([`${localPath}.js`, `${__dirname}/component/Basic.js`]);    
  replaceContent(`${localPath}.js`)
  main([`${localPath}.less`, `${__dirname}/component/Basic.less`]);    
  replaceContent(`${localPath}.less`)

  console.log("创建组件成功")
}
if (program.route)
  console.log('route')



function copy(filename,src) {
    fs.writeFileSync(filename, fs.readFileSync(src));   //filename如果不存在，则会在路径上新建文件
}

function main(argv) {
    copy(argv[0], argv[1]);   //argv[0]为要拷贝的文件名，argv[1]为拷贝数据的来源
    
}

function replaceContent(filePath) {
  fs.readFile(filePath,'utf8',function(err,files){
    //console.log(files)
    var result = files.replace(/Basic/g, name);

    fs.writeFile(filePath, result, 'utf8', function (err) {
         if (err) return console.log(err);
    });
  })
}

function deleteFolder(path) {
  if( fs.existsSync(path) ) {
    fs.unlinkSync(path);
  }
}
