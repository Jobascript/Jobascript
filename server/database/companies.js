var Promise = require('bluebird');
var helpers = require('./helpers.js');

const TABLE_NAME = 'companies';

module.exports = function (db) {
  var Companies = {};

  /**
   * Delete all rows in table
   */
  Companies.clearAll = function () {
    return db.tx(function (t) {
      t.batch([
        t.none('DELETE FROM "jobs";'),
        t.none('DELETE FROM ${table~};', { table: TABLE_NAME })
      ]);
    });
  };

  /**
   * @param  {Object} options obj e.g. {size: 10}, {size:false} to get all
   * @return {Array} Array of company objects
   */
  Companies.getCompanies = function (options) {
    var size = (options && options.size !== undefined) ? options.size : 10;
    var filter = (options && options.filter) || { 1: 1 };

    var sqlStr = [
      'SELECT * FROM ${table~}',
      'WHERE ' + helpers.toSqlString(filter, 'AND'),
      'ORDER BY created DESC',
      'LIMIT ${size:raw}',
      ';'
    ].join(' ');

    return db.query(sqlStr, {
      table: TABLE_NAME,
      size: size || 'ALL'
    }).catch(function (err) {
      return Promise.reject(err);
    });
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
      'INSERT INTO ${table~} (name, display_name, domain, logo)',
      'VALUES',
      '(',
        [
          '${name}',
          '${display_name}',
          '${domain}',
          '${logo}'
        ].join(', '),
      ') RETURNING id;'
    ].join(' ');
    /* eslint-enable */

    return db.one(sqlStr, {
      table: TABLE_NAME,
      name: company.name,
      display_name: company.display_name || null,
      domain: company.domain || null,
      logo: company.logo || null
    }).then(function (result) {
      return result.id;
    }).catch(function (err) {
      return Promise.reject(err);
    });
  };

  /**
   * @param  {Object} args e.g. {name: 'google'} or {id: 2} or {domain: 'google.com'}
   * @return {Object} a company object
   */
  Companies.getCompany = function (args) {
    var sqlStr = 'SELECT * FROM ${table~} WHERE ' + helpers.toSqlString(args, 'OR') + ';';

    return db.one(sqlStr, {
      table: TABLE_NAME
    }).catch(function (err) {
      return Promise.reject(err);
    });
  };

  /**
   * Update a Company
   * @param  {Object} company The Company to be updated. e.g. {name: 'google'} or {id: 2}
   * @param  {Object} args     Properties as columns
   *                           e.g. {
   *                                  description: '...',
   *                                  legalName: '...',
   *                                  url: '...'
   *                                }
   * @return {Promise}         resolve with number of rows changed
   */
  Companies.updateCompany = function (company, args) {
    if (company === undefined) return Promise.reject('Must provide company');
    if (args === undefined) return Promise.reject('Must provide arg');

    var sqlStr = 'UPDATE ${table~} SET ' + helpers.toSqlString(args, ',') +
      ' WHERE ' + helpers.toSqlString(company, 'AND') + ';';

    return db.result(sqlStr, {
      table: TABLE_NAME
    }).then(function (result) {
      return result.rowCount;
    }).catch(function (err) {
      return Promise.reject(err);
    });
  };

  return Companies;
};
