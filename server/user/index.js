var db = require('../../server/database').usersTable;

exports.followCompany = function (req, res) {
  var userID = req.params.user_id;
  var companyID = req.params.company_id;

  if (!userID || !companyID) {
    res.status(400).send('user ID and company ID is required');
  }

  db.followCompany(userID, companyID).then(function () {
    res.sendStatus(200);
  }, function (reason) {
    res.status(406).send(reason);
  }).catch(function (err) {
    res.status(500).send(err);
  });
};

exports.unfollowCompany = function (req, res) {
  var userID = req.params.user_id;
  var companyID = req.params.company_id;

  db.unfollowCompany(userID, companyID).then(function () {
    res.sendStatus(200);
  }, function (reason) {
    res.status(500).send(reason);
  })
  .catch(function (err) {
    res.status(500).send(err);
  });
};

exports.getCompanies = function (req, res) {
  var userID = req.params.user_id;

  db.getCompanies(userID).then(function (companies) {
    res.status(200).send(companies);
  }, function (reason) {
    res.status(500).send(reason);
  })
  .catch(function (err) {
    res.status(500).send(err);
  });
};

exports.createUser = function (req, res) {
  var user = req.body;

  db.createUser(user).then(function (newUser) {
    res.status(201).send(String(newUser.id));
  }, function (reason) {
    if (reason.indexOf('duplicate') !== -1) {
      res.status(409).send(reason);
    } else {
      res.status(500).send(reason);
    }
  })
  .catch(function () {
    res.sendStatus(500);
  });
};
