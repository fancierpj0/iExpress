// const express = require('express');
const express = require('../lib/express');
const app = express();

// 使用next不用for
// 如果.get(path,cb1,cb2) 要在cb1中决定是否向下走,执行cb2
app
  .get('/hello',function(req,res){
    res.write('hello,');
    // this.stop = true;
    this.error = true; //交给错误处理中间件来处理。。 中间件还没实现，但原则上来说是能行的
    // next(); //两个都能执行
  },function(req,res,next){
    res.write('world');
    this.stop = true;
    // next();
  })
  .get('/other',function(req,res){
    console.log('不会走这里');
    // next();
  })
  .get('/hello',function(req,res){
    res.end('!');
  })
.listen(8080,function(){
  let tip = `server is running at 8080`;
  console.log(tip);
});