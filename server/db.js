var sqlite3 = require('sqlite3').verbose();
var path = require('path');
var moment = require('moment');

var db = new sqlite3.Database(path.join(__dirname, '../db/jobascript.sqlite3'), function(err) {
  if(err) {
    console.error('Database connection error: ', err);
  }
});

db.serialize(function() {
  //Uncomment to drop tables when restarting the server
  db.run('DROP TABLE IF EXISTS companies');

  db.run('CREATE TABLE IF NOT EXISTS companies (id INTEGER PRIMARY KEY ASC, name TEXT, created TEXT)');
});

/**
 * @param {Object} company - e.g. {name: 'Google'...}
 * @return {Promise} resolve with company id
 */
db.addCompany = function(company) {
  var stmt = db.prepare('INSERT INTO companies (name, created) VALUES ($name, $created)');

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
 * @return {Null} if company does not exist
 * @return {Object}  if company is removed successfully
 */
db.removeCompany = function(id) {

};

module.exports = db;
