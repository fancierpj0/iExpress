## 中间件分类
应用级中间件:
```javascript
let r1 = express.Router();
app.use('/user',r1);
```
路由级中间件:
```javascript
app.use('/a',function(){})
```
错误中间件
内置中间件
第三方中间件