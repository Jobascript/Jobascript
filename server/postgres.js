var config = require('./common.js').config();
var Promise = require('bluebird');
var options = {
  promiseLib: Promise
};

var pgp = require('pg-promise')(options);

var cn = {
  host: config.dbUrl, // server name or IP address;
  port: 5432,
  database: config.dbName,
  user: 'jbs',
  password: 'abcd1234'
};

var db = pgp(cn);
/* eslint-disable */
var companiesTable = [
  'CREATE TABLE IF NOT EXISTS companies',
  '(',
    [
      'id SERIAL PRIMARY KEY',
      'name TEXT UNIQUE',
      'displayName TEXT',
      'legalName TEXT',
      'domain TEXT UNIQUE',
      'description TEXT',
      'location TEXT',
      'foundedDate TEXT',
      'url TEXT',
      'logo TEXT',
      'created TIMESTAMP WITHOUT TIME ZONE'
    ].join(', '),
  ');'
].join(' ');
/* eslint-disable */

db.query('DROP TABLE IF EXISTS companies')
.then(db.query(companiesTable))
.then(function (stuff) {
  console.log('yea ', stuff);
});
