//write a filter that makes sure that the job posting is actually from the company.
var Promise = require('bluebird');
var _ = require('underscore');
var config = require('../server/common.js').config();
var clearbit = require('clearbit')(config.clearbitKey);
var db = require('../server/database');
var rp = require('request-promise');
var jobTable = require('../server/database').jobsTable;


db.companiesTable.getCompanies()
  .then(function(companyArr) {
    var companyInfo = _.map(companyArr, function (company) {
      return [Number(company.id), company.name];
    });
    return new Promise(function (resolve, reject) {
      return Promise.map(companyInfo, function (companyObj) {
        return rp('https://jobs.github.com/positions.json?description=' + companyObj[1])
        .then(function (data) {
          var jobLists = JSON.parse(data);
          var filteredJobs = _.filter(jobLists, function(job) {
            return job.company.toLowerCase().indexOf(companyObj[1].toLowerCase()) !== -1;
          });
          _.each(filteredJobs, function(job) {
            // console.log(job.company.toLowerCase().indexOf(companyObj[1].toLowerCase()) === 0);
            if (job.company.toLowerCase().indexOf(companyObj[1].toLowerCase()) === 0) {
              job.id = companyObj[0];
            }
          });
          resolve(filteredJobs);
        });
      });
    })
        .then(function (data) {
          _.each(data, function (job) {
            var resultObj = {
              title: job.title,
              url: job.url,
              description: job.description,
              visa_sponsored: null,
              remote_ok: null,
              relocation: null,
              salary: null,
              created: job.created_at,
              city: job.location,
              company_id: job.id
            };
            console.log(resultObj);
            jobTable.addJob(resultObj);
          });
        });
      })
    .catch(function (err) {
      console.log('error in github api call', err);
    });
