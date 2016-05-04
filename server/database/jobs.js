var _ = require('underscore');
var promise = require('bluebird');

const TABLE_NAME = 'jobs';

module.exports = function (db) {
  var Jobs = {};


  Jobs.clearAllJobs = function() {

  };


  Jobs.getJobs = function () {

  };

  Jobs.updateJobs = function() {

  };

  Jobs.addJob = function(jobListing) {
    if (!jobListing) {
      throw new Error('a job obj is required to query for jobs e.g {title: \'software engineer\'}');
    }
    _.extend(jobListing, {table: TABLE_NAME});
    var sqlStr = [
      'INSERT INTO ${table~} (title, url, description, visa_sponsored, remote_ok, relocation, salary, city)',
      'VALUES',
      '(',
        [
          '${title}',
          '${url}',
          '${description}',
          '${visa_sponsored}',
          '${remote_ok}',
          '${relocation}',
          '${salary}',
          '${city}'
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


  return Jobs;
};
