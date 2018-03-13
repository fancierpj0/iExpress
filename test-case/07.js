//*
let express = require('express');
let app = express();

app
  .use('*',function(req,res,next){
    res.setHeader('Content-Type','text/html;charset=utf-8');
    res.write('我是*中间件');
    next();
  })
  .get('*',function(req,res,next){
    res.end('hello');
  })
.listen(8080);

//<<<
//我是*中间件hello