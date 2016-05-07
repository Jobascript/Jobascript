var db = require('../../server/database').usersTable;
var auth = require('../auth');

exports.followCompany = function (req, res) {
  var userID = req.params.user_id;
  var companyID = req.params.company_id;

  if (!userID || !companyID) {
    res.status(400).send('user ID and company ID is required');
    return;
  }

  db.followCompany(userID, companyID).then(function () {
    res.sendStatus(200);
  }).catch(function (reason) {
    res.sendStatus(500);
    console.log('follow failed: ', reason);
  });
};

exports.unfollowCompany = function (req, res) {
  var userID = req.params.user_id;
  var companyID = req.params.company_id;

  db.unfollowCompany(userID, companyID).then(function () {
    res.sendStatus(200);
  })
  .catch(function (reason) {
    res.sendStatus(500);
    console.log('unfollow failed: ', reason);
  });
};

exports.getCompanies = function (req, res) {
  var userID = req.params.user_id;

  db.getCompanies(userID).then(function (companies) {
    res.status(200).send(companies);
  })
  .catch(function (reason) {
    res.sendStatus(500);
    console.log('getCompanies failed: ', reason);
  });
};

exports.createUser = function (req, res) {
  var user = req.body.username ? req.body : null;

  db.createUser(user)
  .then(function (newUser) {
    auth.genToken({
      username: newUser.username,
      temp: newUser.temp
    }).then(function (tkn) {
      res.status(201).send(tkn);
    });
  }, function () {
    return Promise.reject('already exists');
  })
  .catch(function (reason) {
    if (reason === 'already exists') {
      res.status(302).send(reason);
      console.log('createUser failed: ', reason);
    } else {
      res.status(500).send(reason);
    }
  });
};
