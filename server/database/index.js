var config = require('../common.js').config();
var Promise = require('bluebird');
var options = {
  promiseLib: Promise
};
var monitor = require('pg-monitor');
var pgp = require('pg-promise')(options);

if (process.env.NODE_ENV !== 'test' || config.debug) {
  monitor.attach(options);
}


var cn = process.env.DATABASE_URL || 'postgres://jbs:abcd1234@localhost:5432/' + config.dbName;

var db = pgp(cn);

exports.usersTable = require('./users.js')(db);
exports.companiesTable = require('./companies.js')(db);
exports.newsTable = require('./news.js')(db);
