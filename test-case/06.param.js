const express = require('express');
// const express = require('../lib/express.js');
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
  .param('id',function(req,res,next,value,key){
    console.log('我是id');
    next();
  })

  .get('/account/:name/:id',function(req,res,next){
    console.log('我是没有结束响应的get');
    next();
  }) //动态参数绑定的钩子一次请求当中只会被执行一次

  .get('/account/:name/:id/',function(req,res,next){
    res.setHeader('Content-Type','text/html;charset=utf-8');
    // console.log(req.params.name);
    // console.log(req.params.id);
    // res.write('name:'+req.params.name+'\r\n'); //html中只\r\n会有一个空格 //不设置contentType 则是text 则\r\n能换行
    res.write('name:'+req.params.name+'<br/>');
    res.end('id:'+req.params.id);
  })

// app
//   .param('name', function(req, res, next, value, key) {
//     setTimeout(() => {
//       req.params.id='我是id'
//       next();
//     }, 3000)
//   })
//   .param('id', function(req, res, next, value, key) {
//     console.log('req', req.params.id)
//     console.log('id', value);
//     next();
//   })
//   .get('/account/:name/:id',function(req,res,next){
//
//     res.end('ok');
//   })
.listen(8080);