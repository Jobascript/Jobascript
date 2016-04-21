var express = require('express');
var router = express.Router();
var dummyData = require('../dummyData/dummyData');

router.get('/', function(req, res) {
  res.send('things and stuff');
});

router.post('/', function(req, res) {
  res.send(dummyData);
});

module.exports = router;
