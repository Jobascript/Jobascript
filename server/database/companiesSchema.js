var config = require('../common.js').config();

// var Promise = require('bluebird');
var _ = require('underscore');

const TABLE_NAME = 'companies';

/* eslint-disable */
var companiesTable = [
  'CREATE TABLE IF NOT EXISTS ${table~}',
  '(',
    [
      'name TEXT UNIQUE',
      'displayName TEXT',
      'legalName TEXT',
      'domain TEXT UNIQUE',
      'description TEXT',
      'location TEXT',
      'foundedDate TEXT',
      'url TEXT',
      'logo TEXT',
      'created TIMESTAMP WITHOUT TIME ZONE',
      'id SERIAL PRIMARY KEY'
    ].join(', '),
  ');'
].join(' ');
/* eslint-disable */

module.exports = function(db) {
  if (config.dropDB) {
    db.query('DROP TABLE IF EXISTS ${table~}', {table: TABLE_NAME})
    .then(db.query(companiesTable, {table: TABLE_NAME}))
    .then(function (stuff) {
      console.log('companies Table rebuilt');
    });
  }

  var Companies = {};

  /**
   * Delete all rows in table
   * @return {Promise} resolve to number of rows deleted
   */
  Companies.clearAll = function () {
    return db.none('DELETE FROM ${table~};', {table: TABLE_NAME});
  };

  /**
   * @param  {Object} options obj e.g. {size: 10}, {size:false} to get all
   * @return {Array} Array of company objects
   */
  Companies.getCompanies = function (options) {
    var size = (options && options.size !== undefined) ? options.size : 10;
    var filter = (options && options.filter) || {1:1};

    var sqlStr = [
      'SELECT * FROM ${table~}',
      'WHERE ${where:raw}',
      'ORDER BY created DESC',
      'LIMIT ${size:raw}',
      ';'
    ].join(' ');

    return db.query(sqlStr, {
      table: TABLE_NAME,
      size: size || 'ALL',
      where: function () {
        return toSqlString(filter, 'AND');
      }
    });

    // var stmt = db.prepare(sqlArr.join(' '));

    // return new Promise(function (resolve, reject) {
    //   stmt.all({
    //     $size: size || 100
    //   }, function (error, companies) {
    //     if (error) reject(error);
    //     resolve(companies);
    //   });
    // });
  };

  /**
   * @param {Object} company - e.g. {name: 'google'...}
   * @return {Promise} resolve with company id
   */
  Companies.addCompany = function (company) {
    if (!company) {
      throw new Error('a company obj arg is required! e.g. {name: \'google\'...}');
    } else if (!company.name) {
      throw new Error('company has to have a name property! e.g. {name: \'google\'...}');
    }

    /* eslint-disable indent */
    var sqlStr = [
      'INSERT INTO ${table~} (name, displayName, domain, logo)',
      'VALUES',
      '(',
        [
          '${name}',
          '${displayName}',
          '${domain}',
          '${logo}'
        ].join(', '),
      ') RETURNING id;'
    ].join(' ');
    /* eslint-enable */

    return db.one(sqlStr, {
      table: TABLE_NAME,
      name: String(company.name),
      displayName: company.displayName ? String(company.displayName) : null,
      domain: company.domain ? String(company.domain) : null,
      logo: company.logo ? String(company.logo) : null
    });

    // return new Promise(function (resolve, reject) {
    //   stmt.run({
    //     $name: String(company.name),
    //     $displayName: company.displayName ? String(company.displayName) : null,
    //     $domain: company.domain ? String(company.domain) : null,
    //     $logo: company.logo ? String(company.logo) : null,
    //     $created: moment().toISOString()
    //   }, function (error) {
    //     if (error) reject(error);
    //     resolve(this.lastID); // resolve with id
    //   });
    // });
  };

  // turn obj into sql str, e.g. {a:1, b:2} => 'a=1, b="blah"'
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
        var value = t[1];
        
        if (typeof t[1] === 'string') {
          value = '\'' + t[1] + '\'';
        }

        t[1] = value;
      }

      str = t[0] + operator + t[1];

      // console.log(str);

      return str;
    }).join(' ' + joinWith + ' ');

    return string;
  }

  return Companies;
}

