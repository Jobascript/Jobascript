var db = require('../../server/database').usersTable;
var auth = require('../auth');

exports.followCompany = function (req, res) {
  var userID = req.user.id;
  var companyID = req.params.company_id;

  if (!companyID) {
    res.status(400).send('company ID is required');
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
  var userID = req.user.id;
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
  var userID = req.user.id;

  db.getCompanies(userID).then(function (companies) {
    res.status(200).json(companies);
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
    console.log('>>>>>NEW USER: ', newUser);
    return auth.genToken(newUser);
  }, function () {
    return Promise.reject('already exists');
  })
  .then(function (tkn) {
    res.status(201).json({ token: tkn });
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
