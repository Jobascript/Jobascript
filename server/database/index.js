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


var cn = process.env.DATABASE_URL || 'postgres://jbs:abcd1234@localhost:5432/' + config.dbName;
// var cn = {
//   host: process.env.DATABASE_URL || 'localhost', // DB server URL;
//   port: 5432,
//   database: config.dbName,
//   user: 'jbs',
//   password: 'abcd1234'
// };

var db = pgp(cn);

exports.companiesTable = require('./companiesSchema.js')(db);
