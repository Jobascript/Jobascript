var sqlite3 = require('sqlite3').verbose();
var path = require('path');
var moment = require('moment');

var db = new sqlite3.Database(path.join(__dirname, '../db/jobascript.sqlite3'), function(err) {
  if(err) {
    console.error('Database connection error: ', err);
  }
});

//Uncomment to drop/create tables when restarting the server
// db.serialize(function() {
//   db.run('DROP TABLE IF EXISTS companies');

//   db.run('CREATE TABLE IF NOT EXISTS companies (id INTEGER PRIMARY KEY ASC, name TEXT, created TEXT)');
// });

/**
 * @param {Object} company - e.g. {name: 'Google'...}
 * @return {Promise} resolve with company id
 */
db.addCompany = function(company) {
  var stmt = db.prepare('INSERT INTO companies (name, created) VALUES ($name, $created);');

  return new Promise(function(resolve, reject) {
    stmt.run({
      $name: company.name,
      $created: moment().toISOString()
    }, function(error) {
      if(error) reject(error);
      resolve(this.lastID); // resolve with id
    });
  });
};

/**
 * @param  {Number} id - the company id
 * @return {Promise} resolved with company Obj if company is removed successfully
 *                   reject if company do not exist
 */
db.removeCompany = function(id) {
  id = Number(id);
  if(isNaN(id)) throw TypeError('id must be a Number');

  var delStmt = db.prepare('DELETE FROM companies WHERE id = $id;');
  var seletStmt = db.prepare('SELECT * FROM companies WHERE id = $id;');

  var selectP = new Promise(function(resolve, reject) {
    seletStmt.get({
      $id: id
    }, function(error, row) {
      if(error) reject(error);
      resolve(row);
    });
  });

  var delP = new Promise(function(resolve, reject) {
    delStmt.run({
      $id: id
    }, function(error) {
      if(error) reject(error);
      resolve(this.changes);
    });
  });

  return Promise.all([selectP, delP]).then(function(values) {
    return values[0];
  });

};

module.exports = db;
