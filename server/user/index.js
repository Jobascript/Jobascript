var db = require('../../server/database').usersTable;

exports.followCompany = function (req, res) {
  // user, company
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

// exports.createUser = function (req, res) {
//   var user = req.body;

//   db.createUser(user);
// };
