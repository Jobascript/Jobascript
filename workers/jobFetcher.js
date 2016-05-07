//write a filter that makes sure that the job posting is actually from the company.
var Promise = require('bluebird');
var _ = require('underscore');
var config = require('../server/common.js').config();
var clearbit = require('clearbit')(config.clearbitKey);
var db = require('../server/database');
var rp = require('request-promise');
var jobTable = require('../server/database').jobsTable;
db.companiesTable.addCompany({name: 'Twitch'});
db.companiesTable.getCompanies()
  .then(function (companyArr) {
    // console.log('companyArr', companyArr);
    return Promise.map(companyArr, function(companyObj) {
      return rp('http://api.indeed.com/ads/apisearch?publisher=9810665890415219&format=json&v=2&q=' + companyObj.name)
       .then(function (data) {
         var listOfJobs = JSON.parse(data).results;
        //  console.log(listOfJobs.results);
        //  append the proper data to the proper column name in jobs table\
        //  var listOfJobs = data.results;
        //  console.log("LIST:", listOfJobs);
        console.log(companyObj.name);
         var filteredListOfJobs = _.filter(listOfJobs, function(job, key) {
          //  console.log('job inside filter', job);
           console.log("val", job, key)
           console.log(companyObj.name);
           var key = job.company.toLowerCase().indexOf(companyObj.name.toLowerCase());
           console.log("KEY,", key);
           return key !== -1;
         });
         console.log("filtered", filteredListOfJobs);
       });
    })
    .then(function (data) {
      // console.log('last then', data);
      // var newJob = convertKeysToProperKeys(data);
      // jobTable.addJob(newJob);

    });
  })
  .catch(function (err) {
    console.log('err in jobFetcher.js', err);
  });


  function convertKeysToProperKeys(listOfJobs) {
    var resultArr = [];
    var resultObj = {};
    for (var i = 0; i < listOfJobs.length; i++) {
     var currentItem = listOfJobs[i];
     for (var key in currentItem) {
       if (key === 'jobtitle') {
         resultObj.title = currentItem[key];
       }
       if (key === 'url') {
         resultObj.url = currentItem[key];
       }
       if (key === 'snippet') {
         resultObj.description = currentItem[key];
       }
       if (key === 'city') {
         resultObj.city = currentItem[key];
       }
       if (key === 'date') {
         resultObj.created = currentItem[key];
       }
       if (key === 'sponsored') {
         resultObj.visa_sponsored = currentItem[key];
       }
     }
    }
   resultArr.push(resultObj);
   return resultArr;
  }
