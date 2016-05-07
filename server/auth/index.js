var db = require('../../server/database').usersTable;
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
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
  .then(function (userObj) {
    return new Promise(function (resolve, reject) {
      console.log('?????getting token for', userObj);
      jwt.sign(userObj.username, 'CrazyPrivateKey', {}, function (err, token) {
        console.log('got token!!>>>> ', token);
        if (err) reject(err);
        resolve(token);
      });
    });
  }, function (results) {
    // (about results[1]) the middle db promise in tx is to check username collision
    var usernameTaken = !!results[1];

    if (usernameTaken) {
      res.status(409).send('username taken');
    }
  })
  .then(function (tkn) {
    res.status(201).send(tkn); // success
  })
  .catch(function (err) {
    res.status(500).send(err);
  });
};

exports.login = function (req, res) {
  var username = req.body.username;
  var password = req.body.password;
  var userFounded = null;

  db.getUser({ username: username })
  .then(function (user) {
    userFounded = user;
    return checkHash(password, user.password);
  }, function () {
    res.sendStatus(401); // user not found by that username
  })
  .then(function (isPasswordMatched) {
    return isPasswordMatched ? genToken(userFounded) : Promise.reject('wrong password');
  })
  .then(function (token) {
    res.status(200).send(token);
  }, function () {
    res.statusStatus(401); // wrong password
  })
  .catch(function (err) {
    res.status(500).send(err);
  });
};

function genToken(userObj) {
  return new Promise(function (resolve, reject) {
    console.log('?????getting token for', userObj);
    jwt.sign(userObj.username, 'CrazyPrivateKey', {}, function (err, token) {
      console.log('got token!!>>>> ', token);
      if (err) reject(err);
      resolve(token);
    });
  });
}

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
