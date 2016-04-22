var sqlite3 = require('sqlite3').verbose();
var path = require('path');
var moment = require('moment');

var db = new sqlite3.Database(
  path.join(__dirname, '../db/jobascript.sqlite3'), function (err) {
    if (err) {
      console.error('Database connection error: ', err);
    }
  }
);

// Uncomment to drop/create tables when restarting the server
/* eslint-disable */

// db.serialize(function() {
//   db.run('DROP TABLE IF EXISTS companies');

  db.run('CREATE TABLE IF NOT EXISTS companies (id INTEGER PRIMARY KEY ASC, name TEXT, created TEXT)');
// });
/* eslint-enable */

/**
 * @param  {Object} options obj e.g. {size: 10}
 * @return {Array} Array of company objects
 */
db.getCompanies = function (options) {
  var size = (options && options.size) || 10;
  var stmt = db.prepare('SELECT * FROM companies ORDER BY created ASC LIMIT $size;');

  return new Promise(function (resolve, reject) {
    stmt.all({
      $size: size
    }, function (error, companies) {
      if (error) reject(error);
      resolve(companies);
    });
  });
};

/**
 * @param  {Object} e.g. {name: 'Google'} or {id: 2}
 * @return {Object} a comapany object
 */
db.getCompany = function (args) {
  var company = args;
  var stmt;

  if (company.id) {
    stmt = db.prepare('SELECT * FROM companies WHERE id = $id;');
  } else if (company.name) {
    stmt = db.prepare('SELECT * FROM companies WHERE name = $name;');
  } else {
    return Promise.reject('arg must include either an id or name property');
  }

  return new Promise(function (resolve, reject) {
    console.log('company: ', company);
    stmt.get({
      $id: company.id,
      $name: company.name
    }, function (error, row) {
      if (error) reject(error);
      if (!row) reject('not found');
      resolve(row);
    });
  });
};

/**
 * @param {Object} company - e.g. {name: 'Google'...}
 * @return {Promise} resolve with company id
 */
db.addCompany = function (company) {
  var stmt;

  if (!company) {
    throw new Error('a company obj arg is required! e.g. {name: \'Google\'...}');
  } else if (!company.name) {
    throw new Error('company has to have a name property! e.g. {name: \'Google\'...}');
  }

  stmt = db.prepare('INSERT INTO companies (name, created) VALUES ($name, $created);');

  return new Promise(function (resolve, reject) {
    stmt.run({
      $name: String(company.name),
      $created: moment().toISOString()
    }, function (error) {
      if (error) reject(error);
      resolve(this.lastID); // resolve with id
    });
  });
};

/**
 * @param  {Number} id - the company id
 * @return {Promise} resolved with company Obj if company is removed successfully
 *                   reject if company do not exist
 */
db.removeCompany = function (id) {
  var delStmt;
  var seletStmt;
  var selectP;
  var delP;

  if (isNaN(Number(id))) throw new TypeError('id must be a Number');

  delStmt = db.prepare('DELETE FROM companies WHERE id = $id;');
  seletStmt = db.prepare('SELECT * FROM companies WHERE id = $id;');

  selectP = new Promise(function (resolve, reject) {
    seletStmt.get({
      $id: id
    }, function (error, row) {
      if (error) reject(error);
      if (!row) reject('not found');
      resolve(row);
    });
  });

  delP = new Promise(function (resolve, reject) {
    delStmt.run({
      $id: id
    }, function (error) {
      if (error) reject(error);
      resolve(this.changes);
    });
  });

  return Promise.all([selectP, delP]).then(function (values) {
    return values[0];
  }).catch(function (err) { throw new Error(err); });
};

module.exports = db;
