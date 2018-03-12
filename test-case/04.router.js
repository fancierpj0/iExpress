// const express = require('express');
const express = require('../lib/express.js');
const app = express();

const user = express.Router();
  user.use(function(req,res,next){
    res.setHeader('Content-Type','text/html;charset=uft-8');
    res.write('middle:/  ');
    next();
  });
  user.use('/1',function(req,res,next){
    res.write('middle:/1  ');
    next();
  });

app
  // .get('/user',user) //这种get套子路由的需求是不存在的
  .use('/user',user)
  .get('/user',function(req,res,next){
    res.end('get:/user')
  })
  .get('/user/1',function(req,res,next){
    res.end('get:/user/1')
  })
.listen(8080);