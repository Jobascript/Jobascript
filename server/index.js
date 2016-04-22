var express = require('express');
var app = express();

var port = process.env.PORT || 8080;
require('./config/middleware.js')(app, express);
require('./routes')(app);

app.listen(port, function () {
  console.log('server is listening to ' + port);
});

module.exports = app;
