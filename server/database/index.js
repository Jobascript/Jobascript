var config = require('../common.js').config();
var Promise = require('bluebird');
var options = {
  promiseLib: Promise
};
var monitor = require('pg-monitor');
var pgp = require('pg-promise')(options);

if (process.env.NODE_ENV !== 'test') {
  monitor.attach(options);
}

var cn = {
  host: config.dbUrl, // server name or IP address;
  port: 5432,
  database: config.dbName,
  user: 'jbs',
  password: 'abcd1234'
};

var db = pgp(cn);

exports.companiesTable = require('./companiesSchema.js')(db);
