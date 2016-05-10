var _ = require('underscore');
var promise = require('bluebird');

const TABLE_NAME = 'jobs';

module.exports = function (db) {
  var Jobs = {};


  Jobs.clearAllJobs = function() {
    return db.none('DELETE FROM ${table~};', { table: TABLE_NAME });
  };


  Jobs.getJobs = function (options) {
    var sqlStr = 'SELECT * FROM ${table~} WHERE ' + toSqlString(options, 'AND') + ' ;';
    return db.result(sqlStr, {
      table: TABLE_NAME
    })
    .then(function (data) {
      return data;
    })
    .catch(function (err) {
      return Promise.reject(err);
    });
  };

  Jobs.updateJobs = function(jobId, args) {
    if (jobId=== undefined) {
      return Promise.reject('must have a jobId');
    }
    if (args === undefined) {
      return Promise.reject('must have arguments');
    }
    var sqlStr = 'UPDATE ${table~} SET ' + toSqlString(args, ',') + '  WHERE id = ${job_id};';
    return db.result(sqlStr, {
      table: TABLE_NAME,
      job_id: jobId
    })
    .then(function(data) {
      return data;
    })
    .catch(function(err) {
      return Promise.reject(err);
    });
  };

  Jobs.addJob = function(jobListing) {
    if (!jobListing) {
      throw new Error('a job obj is required to query for jobs e.g {title: \'software engineer\'}');
    }
    _.extend(jobListing, {table: TABLE_NAME});
    var sqlStr = [
      'INSERT INTO ${table~} (title, company_name, url, description, visa_sponsored, remote_ok, relocation, created, city, company_id)',
      'VALUES',
      '(',
        [
          '${title}',
          '${company_name}',
          '${url}',
          '${description}',
          '${visa_sponsored}',
          '${remote_ok}',
          '${relocation}',
          '${created}',
          '${city}',
          '${company_id}'
        ].join(', '),
      ')',
      'RETURNING id'
    ].join(' ');
    return db.query(sqlStr, jobListing)
    .then(function(data) {
      return data;
    })
    .catch(function(err) {
      return Promise.reject(err);
    });
  };

  // turn obj into sql str, e.g. {a:1, b:2} => 'a=1, b="blah"'
  // joinWith needs to be a String 'AND', 'OR' or ','
  function toSqlString(obj, joinWith) {
    var tuples = _.pairs(obj);

    var string = tuples.map(function (tuple) {
      var t = tuple.slice();
      var str;
      var operator = '=';

      if (t[1] === null) {
        operator = ' IS ';
        t[1] = String(t[1]).toUpperCase();
      } else {
        t[1] = '$$' + t[1] + '$$'; // escape stuff
      }

      str = t[0] + operator + t[1];

      return str;
    }).join(' ' + joinWith + ' ');

    return string;
  }
  return Jobs;
};
