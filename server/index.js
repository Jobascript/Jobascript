<<<<<<< HEAD
var express = require('express');
var bodyParser = require('body-parser');
var dummyData = require('./dummyData/dummyData');
var company = require('./company/index');
var app = express();
var router = express.Router();

app.set('port', (process.env.PORT || 8080));
app.use(bodyParser.json());
app.use('/company', company);
// app.use(express.static(path.join(__dirname + '../client/dist')));

router.get('/', function(req, res) {
  res.send(200);
});

// app.use('/api', router);

var server = app.listen(app.get('port'), function() {
  var port = server.address().port;
  console.log('server is running on ' + port);
});

module.exports = router;
