//write a filter that makes sure that the job posting is actually from the company.
var Promise = require('bluebird');
var _ = require('underscore');
var config = require('../server/common.js').config();
var clearbit = require('clearbit')(config.clearbitKey);
var db = require('../server/database');
var rp = require('request-promise');
var jobTable = require('../server/database').jobsTable;
// db.companiesTable.addCompany({name: 'Apple'});
db.companiesTable.getCompanies()
  //promise for getCompanies
  .then(function (companyArr) {
    // console.log('companyArr', companyArr);
    // console.log(companyArr);
    var companyInfo = _.map(companyArr, function(company) {
      return [Number(company.id), company.name];
    });
    return new Promise(function(resolve, reject) {
      return Promise.map(companyInfo, function(companyObj) {
        // console.log(companyObj);
          return rp('http://api.indeed.com/ads/apisearch?publisher=9810665890415219&format=json&v=2&q=' + companyObj[1])
           .then(function (data) {
              var listOfJobs = JSON.parse(data).results;
             var filteredListOfJobs = _.filter(listOfJobs, function(job) {
              return job.company.toLowerCase().indexOf(companyObj[1].toLowerCase()) !== -1;
             });
             _.each(filteredListOfJobs, function(jobs) {
               if (jobs.company === companyObj[1]) {
                jobs.id = companyObj[0];
               }
             });
            resolve(filteredListOfJobs);
          });
      });
    })
    .then(function (data) {
      _.each(data, function(job) {
        var resultObj = {
          title: job.jobtitle,
          company_name: job.company,
          url: job.url,
          description: function() {return job.snippet.replace(/<\/*[\s\S]+?>|\u2022/g, '').replace(/^[ \t]+|[ \t]+$/gm, '').replace(/ +/g, ' ');},
          visa_sponsored: job.sponsored,
          remote_ok: null,
          relocation: null,
          created: job.date,
          city: job.city,
          company_id: job.id
        };
        jobTable.addJob(resultObj);
        });
      });
    })
  .catch(function (err) {
    console.log('err in jobFetcher.js', err);
  });
