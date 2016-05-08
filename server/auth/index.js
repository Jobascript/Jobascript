var db = require('../../server/database').usersTable;
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
var Promise = require('bluebird');

var SECRET = 'CrazyPrivateKey';

// API
module.exports = {
  signup: signup,
  login: login,
  verify: verify,
  genToken: genToken
};

function verify(req, res) {
  verifyToken(req.params.token)
  .then(function (user) {
    res.status(200).send(user);
  })
  .catch(function (reason) {
    console.log('token failed: ', reason);
    res.sendStatus(401);
  });
}

function verifyToken(token) {
  return new Promise(function (resolve, reject) {
    jwt.verify(token, SECRET, function (err, decoded) {
      if (err) reject(err);
      resolve(decoded);
    });
  });
}

function signup(req, res) {
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
  })
  .then(function (userObj) {
    return genToken({
      username: userObj.username,
      id: userObj.id,
      temp: userObj.temp,
      created: userObj.created
    });
  }, function (results) {
    // (about results[1]) the middle db promise in tx is to check username collision
    var usernameTaken = !!results[1];
    var reason = null;
    if (usernameTaken) {
      reason = 'username taken';
    } else {
      reason = results;
    }

    return Promise.reject(reason);
  })
  .then(function (tkn) {
    res.status(201).send(tkn); // success
  })
  .catch(function (reason) {
    if (reason === 'username taken') {
      res.status(409).send('username taken');
    } else if (reason === 'user is already registered') {
      res.status(422).send(reason);
    } else {
      res.sendStatus(500);
      console.log(reason);
    }
  });
}

function login(req, res) {
  var username = req.body.username;
  var password = req.body.password;
  var userFounded = null;

  db.getUser({ username: username })
  .then(function (user) {
    userFounded = user;
    return checkHash(password, user.password);
  }, function () {
    return Promise.reject('user not found'); // user not found by that username
  })
  .then(function (isPasswordMatched) {
    console.log('password match? ', isPasswordMatched);
    return isPasswordMatched ? genToken({
      username: userFounded.username,
      temp: userFounded.temp
    }) : Promise.reject('wrong password');
  })
  .then(function (token) {
    res.status(200).send(token);
  })
  .catch(function (reason) {
    console.log('password check result>>>> ', reason);
    if (reason === 'wrong password' || reason === 'user not found') {
      res.sendStatus(401);
    } else {
      res.sendStatus(500);
      console.log(reason);
    }
  });
}

function genToken(userObj) {
  return new Promise(function (resolve, reject) {
    console.log('?????getting token for', userObj);
    jwt.sign(userObj, SECRET, {}, function (err, token) {
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
    bcrypt.compare(password, hash, function (err, res) {
      if (err) reject(err);
      resolve(res);
    });
  });
}
