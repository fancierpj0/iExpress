// const express = require('express');
const express = require('../lib/express.js');
const app = express();
let slice = Array.prototype.slice;

app
  .param('name',function(req,res,next,value,key){ //不支持在一个动作里同时注册多个cb，但支持分开注册cb到同一个动态参数下
    console.log(slice.call(arguments,3)); //[ 'ahhh', 'name' ]
    next();
  })
  .param('name',function(req,res,next,value,key){
    console.log('同个动态参数下绑定的第二个函数');
    next();
  })
  .get('/account/:name/:id/',function(req,res,next){
    res.setHeader('Content-Type','text/html;charset=utf-8');
    console.log(req.params.name);
    console.log(req.params.id);
    // res.write('name:'+req.params.name+'\r\n'); //html中只\r\n会有一个空格 //不设置contentType 则是text 则\r\n能换行
    res.write('name:'+req.params.name+'<br/>');
    res.end('id:'+req.params.id);
  })
.listen(8080);