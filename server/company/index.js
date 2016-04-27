var config = require('../common.js').config();
var db = require('../db')(config);

var inflection = require('inflection');

exports.getCompanies = function (req, res) {
  var options = req.query;

  db.getCompanies(options).then(function (companies) {
    res.status(200).send(companies);
  }).catch(function (err) {
    console.log(err);
    res.sendStatus(500);
  });
};

exports.getCompany = function (req, res) {
  db.getCompany({ id: req.params.id }).then(function (company) {
    res.status(200).send(company);
  }).catch(function (err) {
    console.log(err);
    res.sendStatus(500);
  });
};

exports.addCompany = function (req, res) {
  db.addCompany({
    name: inflection.dasherize(req.body.name),
    displayName: req.body.displayName,
    domain: req.body.domain,
    logo: req.body.logo
  })
  .then(function (companyID) {
    res.status(200).send(companyID.toString());
  }).catch(function (err) {
    console.log(err);
    res.sendStatus(500);
  });
};

exports.removeCompany = function (req, res) {
  db.removeCompany(req.params.id)
  .then(function (company) {
    console.log('company ' + company + ' has been successfully removed');
    res.sendStatus(200);
  }, function () {
    res.sendStatus(404);
  }).catch(function (err) {
    console.log(err);
    res.sendStatus(500);
  });
};
