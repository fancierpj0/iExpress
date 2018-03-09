const http = require('http');
const url = require('url');
const Router = require('./router');

function Application(){

}

Application.prototype.lazyrouter = function(){
  if(!this._router){
    this._router= new Router();
  }
};

http.METHODS.forEach(function(METHOD){
  let method = METHOD.toLowerCase();
  Application.prototype[method] = function(){
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

Application.prototype.listen = function(){
  let self = this;
  let server = http.createServer(function(req,res){
    function done(){
      let tip = `Cannot ${req.method} ${req.url}`;
      res.end(tip);
    }
    // console.log('-请求来临-');
    self._router.handle(req,res,done);
  });

  server.listen.apply(server,arguments);
};

module.exports = Application;