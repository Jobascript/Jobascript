var sqlite3 = require('sqlite3').verbose();
var path = require('path');
var moment = require('moment');


module.exports = function (config) {
  var db = new sqlite3.Database(
    path.join(__dirname, '../db/' + config.database), function (err) {
      if (err) {
        console.error('Database connection error: ', err);
      }
    }
  );

  /* eslint-disable */

  // Uncomment the following to drop/create tables when restarting the server
  // if (config.dropDB) {
  //   db.serialize(function() {
  //     db.run('DROP TABLE IF EXISTS companies');
  //     var companiesTable = [
  //       'CREATE TABLE IF NOT EXISTS companies',
  //       '(',
  //         [
  //           'id INTEGER PRIMARY KEY ASC',
  //           'name TEXT UNIQUE',
  //           'displayName TEXT',
  //           'legalName TEXT',
  //           'domain TEXT UNIQUE',
  //           'description TEXT',
  //           'location TEXT',
  //           'foundedDate TEXT',
  //           'url TEXT',
  //           'logo TEXT',
  //           'created TEXT'
  //         ].join(', '),
  //       ');'
  //     ].join(' ');
  //     db.run(companiesTable);
  //   });
  // }

  /* eslint-enable */

  /**
   * @param  {Object} options obj e.g. {size: 10}
   * @return {Array} Array of company objects
   */
  db.getCompanies = function (options) {
    var size = (options && options.size) || 10;
    var stmt = db.prepare('SELECT * FROM companies ORDER BY created DESC LIMIT $size;');

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
   * @param {Object} company - e.g. {name: 'google'...}
   * @return {Promise} resolve with company id
   */
  db.addCompany = function (company) {
    var stmt;

    if (!company) {
      throw new Error('a company obj arg is required! e.g. {name: \'google\'...}');
    } else if (!company.name) {
      throw new Error('company has to have a name property! e.g. {name: \'google\'...}');
    }

    /* eslint-disable indent */
    stmt = db.prepare([
      'INSERT INTO companies (name, displayName, domain, logo, created)',
      'VALUES',
      '(',
        [
          '$name',
          '$displayName',
          '$domain',
          '$logo',
          '$created'
        ].join(', '),
      ');'
    ].join(' '));
    /* eslint-enable */

    return new Promise(function (resolve, reject) {
      stmt.run({
        $name: String(company.name),
        $displayName: company.displayName ? String(company.displayName) : null,
        $domain: company.domain ? String(company.domain) : null,
        $logo: company.logo ? String(company.logo) : null,
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
    if (isNaN(Number(id))) throw new TypeError('id must be a Number');

    var delStmt = db.prepare('DELETE FROM companies WHERE id = $id;');

    var deleteCompany = function (company) {
      return new Promise(function (resolve, reject) {
        delStmt.run({
          $id: company.id
        }, function (error) {
          if (error) reject(error);
          resolve(company);
        });
      });
    };

    return db.getCompany({ id: id })
    .then(deleteCompany, function (reason) {
      // rejected by getCompany
      return Promise.reject(reason);
    });
  };

  return db;
};
