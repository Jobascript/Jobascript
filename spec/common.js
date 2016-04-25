var env = require('../env.json');

exports.config = function() {
  var nodeEnv = 'test';
  return env[nodeEnv];
};
