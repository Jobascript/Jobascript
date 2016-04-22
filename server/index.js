
var express = require('express');
var app = express();

// app.set('port', (process.env.PORT || 8080));
var port = process.env.PORT || 8080;
var config = require('./config/middleware.js')(app, express);
var routes = require('./routes')(app);

var server = app.listen(port, function() {
  console.log('server is listening to ' + port);
});


// app.use('/api', router);

module.exports = app;
