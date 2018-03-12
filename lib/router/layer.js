function Layer(path,handler){
  this.path = path;
  this.handler = handler;
}

Layer.prototype.match = function(path){
  if(path===this.path) return true;
  if(!this.route){
    return (this.path=='/'||this.path==path||path.startsWith(this.path+'/'))?true:false;
  }
  return false;
};

Layer.prototype.handle_request = function(req,res,next){
  if(this.handler.length ==4){ //防止 错误中间件存在且路径为/ 请求路径不存在时仍然走错误中间件
    return next();
  }

  this.handler(req,res,next);
};

Layer.prototype.handle_error = function(err,req,res,next){
  // console.log(arguments.length);
  if(!this.middle&&this.handler.length !=4){ //如果是普通中间件就跳过 //路由匹配时不能跳过,此时handler为dispatch，只有3个参数，无法使用.length放行
    return next(err);
  }

  this.handler(err,req,res,next);
};

module.exports = Layer;