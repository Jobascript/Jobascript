var middleware = require('../config/middleware');
var dummyData = require('../dummyData/dummyData');
var db = require('./db');


exports.getCompany = function(req, res) {
  var userCompany = req.body.name;
  db.getCompany({name: userCompany}).then(function(company) {
    res.status(200).send(company);
  }).catch(function(err) {
    console.log(err);
    res.sendStatus(500);
  });
};

exports.addCompany = function(req, res) {
  var userCompany = req.body.name;
  db.addCompany({name: userCompany})
  .then(function(companyID) {
    res.status(200).send(companyID);
  }).catch(function(err) {
    console.log(err);
    res.sendStatus(500);
  });
};



exports.removeCompany = function(req, res) {
  var companyId = req.body.id;
  db.removeCompany(companyId)
  .then(function func(company) {
    console.log('company ' + company + ' has been successfully removed');
    res.sendStatus(200);
  }, function() {
    res.sendStatus(404);
  }).catch(function(err) {
    console.log(err);
    res.sendStatus(500);
  });
};

// module.exports = function(app) {
  // app.get('/', function(req, res) {
  //   res.send('things and stuff');
  // });
  //
  // app.post('/', function(req, res) {
  //   res.send(dummyData);
  // });
// };





//router.delete implement
