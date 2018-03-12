function Layer(path,handler){
  let self = this;
  if(path.endsWith('/'))path=path.slice(0,path.length-1);
  self.path = path;
  self.handler = handler;
  self.keys = [];
  self.regexp = self.pathToRegexp(self.path,self.keys);
}

Layer.prototype.pathToRegexp = function(path,keys){
  if(path.includes(':')){ // /:name/:id
    path = path.replace(/:([^\/]+)/g,function(){ //:name,name
      keys.push({
        name:arguments[1]
        ,optional:false
        ,offset:arguments[2]
      });
      return '([^\/]+)';
    });
    path += '[\\/]?$';
    return new RegExp(path); // --> /\/user\/([^/]+)\/([^/]+)[\/]?/
  }
};

Layer.prototype.match = function(path){
  if(path===this.path) return true;
  if(!this.route){
    return (this.path=='/'||this.path==path||path.startsWith(this.path+'/'))?true:false;
  }
  //是路由 但是路由又不全等？这是什么情况呢 是动态路由！
  if(this.route&&this.regexp){
    let matches = this.regexp.exec(path); // /user/1
    if(matches){
      this.params = {};
      for(let i=1;i<matches.length;++i){
        let name = this.keys[i-1].name;
        let val = matches[i];
        this.params[name] = val;
      }
      return true;
    }
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
  if(!this.middle&&this.handler.length !=4){ //如果是普通中间件就跳过 //路由匹配时不能跳过,此时handler为dispatch，只有3个参数，无法使用.length放行
    return next(err);
  }

  this.handler(err,req,res,next);
};

module.exports = Layer;