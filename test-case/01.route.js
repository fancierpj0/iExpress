// const express = require('express');
const express = require('../lib/express');
const app = express();

app
  .get('/hello',function(req,res,next){ //如果是for遍历 next参数不再需要 使用this.stop阻止继续遍历
    res.write('hello,');
    // this.stop = true;
    // this.error = true; //交给错误处理中间件来处理。。 中间件还没实现，但原则上来说是能行的
    next(); //两个都能执行
  },function(req,res,next){
    res.write('world');
    // this.stop = true;
    next();
  })
  .get('/other',function(req,res,next){
    console.log('不会走这里');
    next();
  })
  .get('/hello',function(req,res,next){
    res.end('!');
  })
.listen(8080,function(){
  let tip = `server is running at 8080`;
  console.log(tip);
});