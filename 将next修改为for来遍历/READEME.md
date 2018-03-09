## 修改router/index.js 下的 handle方法
    
```javascript
  let self = this
    ,{pathname} = url.parse(req.url,true);

  for(let i=0;i<self.stack.length;++i){
    if(i>=self.stack.length){
      return done();
    }
    let layer = self.stack[i];
    if(layer.match(pathname)){
      if(!layer.route){

      }else{

        if(layer.route&&layer.route.handle_method(req.method)){
          // let flag = layer.handle_request(req,res);

          for(let j=0;j<layer.route.stack.length;++j){
            let handleLayer = layer.route.stack[j];
            if(handleLayer.method === req.method.toLowerCase()){
              handleLayer.handle_request(req,res);
              if(handleLayer.stop){
                return;
              }
            }
          }//遍历handleLayer

        }//快速匹配成功

      }//说明是路由

    }//匹配路径
  }

```
## 修改调用形式
不再需要next参数，
在回调内部使用this.stop阻止回调继续往下遍历，
同理使用this.error表示交由错误处理中间件来处理
```javascript
app.get('/hello',function(req,res){
    res.write('hello,');
    // this.stop = true;
    this.error = true; //交给错误处理中间件来处理。。 中间件还没实现，但原则上来说是能行的
  },function(req,res,next){
    res.write('world');
    this.stop = true;
  })
```