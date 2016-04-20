var express = require('express');
var bodyParser = require('body-parser');
var dummyData = require('./dummyData/dummyData');
var app = express();
var router = express.Router();

app.set('port', (process.env.PORT || 8080));
app.use(bodyParser.json());


app.get('/', function(req, res) {
  res.send(200);
});


app.get('/company', function(req, res) {
  res.send('hello');
});
app.post('/company', function(req, res) {
  res.send(dummyData);
});

// app.use('/api', router);

var server = app.listen(app.get('port'), function() {
  var port = server.address().port;
  console.log('server is running on ' + port);
});

module.exports = server;
