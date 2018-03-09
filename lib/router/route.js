let http = require('http');
let Layer = require('./layer.js');
let slice = Array.prototype.slice;

function Route(path){
  this.path = path;
  this.methods = {};
  this.stack = [];
}

http.METHODS.push('middle'); //支持多cb中间
http.METHODS.forEach(function(METHOD){
  let method = METHOD.toLowerCase();
  Route.prototype[method] = function(){
    let handlers = slice.call(arguments);
    this.methods[method] = true;

    for(let i=0;i<handlers.length;++i){
      let layer = new Layer('/',handlers[i]);
      layer.method = method;
      this.stack.push(layer);

    }
    return this;
  }
});

Route.prototype.handle_method = function(method){
  return this.methods[method.toLowerCase()]?true:false;
};

Route.prototype.dispatch = function(req,res,out){
  let self = this
    ,index = 0;

  if(arguments.length==4){
    // console.log(arguments);
    // console.log('0:'+arguments[0]);
    // console.log('1'+arguments[1]);
    // console.log('2'+arguments[2]);
    // console.log('3'+arguments[3]);
    // req = arguments[1];
    // res = arguments[2];
    // out = arguments[3];
    // next(arguments[0]);

    args = slice.call(arguments);
    req = args[1];
    res = args[2];
    out = args[3];
    next(args[0]);
  }else{
    next();
  }

  function next(err){
    if(err&&!self.methods['middle']){
      return out(err); //出现错误，并且是路由，退出当前路由交给错误中间件处理
    }

    if(index>=self.stack.length){
      return out(err); //当前路由的layer已经遍历完 跳出 继续匹配下一条路由
    }

    let layer = self.stack[index++];

    if((layer.method === req.method.toLowerCase())){
      layer.handle_request(req,res,next);
    }else if(layer.method==='middle'){
      if(err){
        layer.handle_error(err,req,res,next);
      }else{
        layer.handle_request(req,res,next);
      }
    }else{
      next(err);
    }

  }//next结束

};

module.exports = Route;