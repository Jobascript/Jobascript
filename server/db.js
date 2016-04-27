var sqlite3 = require('sqlite3').verbose();
var path = require('path');
var moment = require('moment');
var Promise = require('bluebird');
var _ = require('underscore');

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
  if (config.dropDB) {
    db.serialize(function() {
      db.run('DROP TABLE IF EXISTS companies');
      var companiesTable = [
        'CREATE TABLE IF NOT EXISTS companies',
        '(',
          [
            'id INTEGER PRIMARY KEY ASC',
            'name TEXT UNIQUE',
            'displayName TEXT',
            'legalName TEXT',
            'domain TEXT UNIQUE',
            'description TEXT',
            'location TEXT',
            'foundedDate TEXT',
            'url TEXT',
            'logo TEXT',
            'created TEXT'
          ].join(', '),
        ');'
      ].join(' ');
      db.run(companiesTable);
    });
  }

  /* eslint-enable */

  /**
   * @param  {Object} options obj e.g. {size: 10}
   * @return {Array} Array of company objects
   */
  db.getCompanies = function (options) {
    var size = (options && options.size) || 10;
    var filter = (options && options.filter) || { 1: 1 };

    var stmt = db.prepare([
      'SELECT * FROM companies',
      'WHERE ' + toSqlString(filter, 'AND'),
      'ORDER BY created DESC',
      'LIMIT $size;'
    ].join(' '));

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
   * @param  {Object} args e.g. {name: 'google'} or {id: 2}
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

  /**
   * Update a Company
   * @param  {Object} comapany The Company to be updated. e.g. {name: 'google'} or {id: 2}
   * @param  {Object} args     Properties as columns
   *                           e.g. {
   *                                  description: '...',
   *                                  legalName: '...',
   *                                  url: '...'
   *                                }
   * @return {Promise}         resolve with number of rows changed
   */
  db.updateCompany = function (comapany, args) {
    if (comapany === undefined) return Promise.reject('Must provide company');
    if (args === undefined) return Promise.reject('Must provide arg');

    var stmt = db.prepare([
      'UPDATE companies',
      'SET ' + toSqlString(args, ','),
      'WHERE ' + toSqlString(comapany, 'AND'),
      ';'
    ].join(' '));

    return new Promise(function (resolve, reject) {
      stmt.run(function (error) {
        // console.log(this.sql);
        if (error) reject(error);
        resolve(this.changes);
      });
    });
  };

  /**
   * Delete all rows in table
   * @return {Promise} resolve to number of rows deleted
   */
  db.clearAll = function () {
    return new Promise(function (resolve, reject) {
      db.run('DELETE FROM companies WHERE 1 = 1;', function (error) {
        if (error) reject(error);
        resolve(this.changes);
      });
    });
  };

  // turn obj into sql str, e.g. {a:1, b:2} => '"a"="1", "b"="2"'
  // joinWith needs to be a String 'AND', 'OR' or ','
  function toSqlString(obj, joinWith) {
    var tuples = _.pairs(obj);

    var string = tuples.map(function (tuple) {
      var t = tuple.slice();
      var str;
      var operator = ' = ';

      if (t[1] === null) {
        operator = ' IS ';
        t[1] = String(t[1]).toUpperCase();
      } else if (typeof t[1] === 'string') {
        t[1] = JSON.stringify(t[1]);
      }

      str = t[0] + operator + t[1];

      // console.log(str);

      return str;
    }).join(' ' + joinWith + ' ');

    return string;
  }

  return db;
};
