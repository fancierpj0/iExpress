const express = require('../lib/express.js');
const app = express();
const util = require('util');

app.get('/',function(req,res){
  console.log(req.query);
  // res.end(util.inspect(req.query));
  res.json({job:'boss'})
});
app.listen(8080);