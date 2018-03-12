// const express = require('express');
const express = require('../lib/express');
let app = express();

app
  .use('/user/',function(req,res,next){
    res.setHeader('Content-Type','text/html;Charset=utf-8');
    console.log('/user中间件');
    res.write('/user中间件&nbsp;');
    next('跳转到错误处理 ---');
    // next();
  },function(err,req,res,next){
    console.log('/user中间件2');
    res.write('/user中间件2&nbsp;');
    res.end(err+'我是同一个中间件中的错误处理');
    // next();
  },function(req,res,next){
    console.log('/user中间件3');
    res.write('/user中间件3&nbsp;');
    next();
  })
  .get('/user',function(req,res,next){
    res.end('/user结束')
  })
  .use(function(err,req,res,next){
    console.log('我是错误处理1');
    res.write(err+'我是错误处理');
    next(err);
  },function(err,req,res,next){
    console.log('我是错误处理2');
    res.write(err+'我是错误处理2'); //不支持
    next(err);
  })
  .use(function(err,req,res,next){
    console.log('我是错误处理3');
    res.end(err+'我是最后的错误处理');
  })

.listen(8080);