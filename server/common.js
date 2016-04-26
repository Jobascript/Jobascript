var env = require('../env.json');

exports.config = function () {
  var nodeEnv = process.env.NODE_ENV || 'development';
  return env[nodeEnv];
};
