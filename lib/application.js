const http = require('http');
const url = require('url');
const Router = require('./router');
const path = require('path');

function Application(){
  this.settings = {}; //用来保存参数
  this.engines = {}; //express可支持多种模板引擎，每种模板引擎的渲染方法是不一样的
}

//传两个参数表示设置，一个参数表示获取
Application.prototype.set = function(key,val){
  if(arguments.length == 1){
    return this.settings[key];
  }
  this.settings[key] = val;
};
// 规定何种文件用什么方法来渲染
Application.prototype.engine = function(ext,render){
  let extension = ext[0] == '.'?ext:'.'+ext;
  this.engines[extension] = render;
  this.lazyrouter();
  this.initRender();
};

Application.prototype.initRender = function(){
  let self = this;
  self.use(function(req,res,next){
    res.render = function(name,data){
      let ext = '.'+self.get('view engine');
      name = name.indexOf('.')!=-1?name:name+ext;
      let filepath = path.join(self.get('views'),name);
      let render = self.engines[ext];
      function done(err,ret){
        if(err)return console.log('发生未知错误，模板渲染出错');
        res.setHeader('Content-Type','text/html');
        res.end(ret);
      }
      render(filepath,data,done);
    };
    next();
  });
};

Application.prototype.lazyrouter = function(){
  if(!this._router){
    this._router= new Router();
  }
};

http.METHODS.forEach(function(METHOD){
  let method = METHOD.toLowerCase();
  Application.prototype[method] = function(){
    if(method === 'get' && arguments.length ===1){ //若为get且只有一个参数 就不再是注册路由功能 而是获取设置参数
      return this.set(arguments[0]);
    }
    this.lazyrouter();
    this._router[method].apply(this._router,arguments);
    return this;
  }
});

Application.prototype.route = function(path){
  this.lazyrouter();
  let route = this._router.route(path);
  return route;
};

Application.prototype.use = function(){
  this.lazyrouter();
  this._router.use.apply(this._router,arguments);
  return this;
};

Application.prototype.param = function(){
  this.lazyrouter();
  this._router.param.apply(this._router,arguments);
  return this;
};

Application.prototype.listen = function(){
  let self = this;
  let server = http.createServer(function(req,res){
    function done(){
      let tip = `Cannot ${req.method} ${req.url}`;
      res.end(tip);
    }
    self._router.handle(req,res,done);
  });

  server.listen.apply(server,arguments);
};

module.exports = Application;