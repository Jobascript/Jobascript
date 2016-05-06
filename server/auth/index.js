var db = require('../../server/database').usersTable;
var bcrypt = require('bcrypt');
var Promise = require('bluebird');

exports.signup = function (req, res) {
  var username = req.body.username;
  var password = req.body.password;
  var userID = req.body.id;

  console.log('>>>>>uid: ', userID);

  // make user its not a full user
  db.isUserTemp(userID).then(function (isTemp) {
    if (!isTemp) return Promise.reject('user is already registered');
    return makeHash(password);
  })
  .then(function (hashedPassword) {
    return db.updateUser(userID, {
      username: username,
      password: hashedPassword
    });
  }, function (reason) {
    res.status(422).send(reason);
  })
  .then(function () {
    res.send(201); // success
  }, function (results) {
    // (about results[1]) the middle db promise in tx is to check username collision
    var usernameTaken = !!results[1];

    if (usernameTaken) {
      res.status(409).send('username taken');
    }
  }).catch(function (err) {
    res.status(500).send(err);
  });
};


function makeHash(password) {
  return new Promise(function (resolve, reject) {
    bcrypt.hash(password, 10, function (err, hash) {
      if (err) reject(err);
      resolve(hash);
    });
  });
}

function checkHash(password, hash) {
  return new Promise(function (resolve, reject) {
    bcrypt.compare(password, hash, function(err, res) {
      if (err) reject(err);
      resolve(res);
    });
  });
}
