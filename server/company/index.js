var db = require('../../server/database').companiesTable;

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
  var type = req.query.type || 'id'; // can be 'id' or 'domain'
  var params = {};
  var username = req.user.username;

  if (type === 'id') {
    params = { id: req.params.id };
  } else if (type === 'domain') {
    params = { domain: req.params.id };
  } else {
    res.sendStatus(400);
  }

  db.getCompany(params).then(function (company) {
    res.status(200).send(company);
  }, function () {
    res.sendStatus(404);
  }).catch(function (err) {
    console.log(err);
    res.sendStatus(500);
  });
};

exports.addCompany = function (req, res) {
  db.addCompany({
    name: inflection.dasherize(req.body.name),
    display_name: req.body.displayName,
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

