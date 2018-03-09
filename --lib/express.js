const Application= require('./application.js');
const Router = require('./router');

function createApplication(){
  return new Application;
}

createApplication.Router = Router;

module.exports = createApplication;