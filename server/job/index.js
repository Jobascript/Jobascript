var middleware = require('../config/middleware');
module.exports = function(app) {
  app.get('/', function(req, res) {
    res.send('route for jobs');
  });
  
};
