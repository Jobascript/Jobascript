//write a filter that makes sure that the job posting is actually from the company.
var Promise = require('bluebird');
var _ = require('underscore');
var config = require('../server/common.js').config();
var clearbit = require('clearbit')(config.clearbitKey);
var db = require('../server/database');
var rp = require('request-promise');
var jobTable = require('../server/database').jobsTable;
// db.companiesTable.addCompany({name: 'CBS Interactive'});
db.companiesTable.getCompanies()
  .then(function (companyObj) {
    var companyArr = _.map(companyObj, function(company) {
      return [Number(company.id), company.name];
    });
    // console.log(companyArr);
    return new Promise(function (resolve, reject) {
      Promise.map(companyArr, function (companyObj) {
        // console.log(companyObj[1]);
        return rp('https://authenticjobs.com/api/?api_key=291d984046483ad333ac5978886bb9ad&format=JSON&method=aj.jobs.search&q=' + companyObj[1])
        .then(function (data) {
          var listOfJobs = JSON.parse(data).listings.listing;
          // console.log(listOfJobs);
            var filteredListOfJobs = _.filter(listOfJobs, function (job) {
              // console.log(job.company.name);
              // console.log(job);
              if (job.company.name.toLowerCase().indexOf(companyObj[1].toLowerCase()) !== -1) {
                return job;
              }
            });
            // console.log(filteredListOfJobs);
            _.each(filteredListOfJobs, function (job) {
              // console.log(job);
              if (job.company.name.toLowerCase() === companyObj[1].toLowerCase()) {
                job.company_id = companyObj[0];
              }
            });
            // console.log(filteredListOfJobs);
            return filteredListOfJobs;
          // console.log(data);
          // console.log(listOfJobs)
        });
      })
      .then(function (data) {
        // console.log(data);
        resolve(data);
      });
    })
    .then(function (job) {
      var finalArr = _.flatten(job);
      _.each(finalArr, function(job) {
        // console.log(job.apply_url);
        resultObj = {
          remote_ok: null,
          salary: null,
          relocation: function() {if (job.relocation_assistance === 1) return true;},
          company: job.company.name,
          title: job.title,
          url: job.apply_url,
          description: job.description,
          city: job.company.location.city,
          created: job.post_date,
          visa_sponsored: false,
          company_id: job.company_id
        };
        jobTable.addJob(resultObj);
      });

    })
    .catch(function (err) {
      console.log('error in authenticjobsFetcher.js', err);
    });
  });
