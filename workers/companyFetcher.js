var config = require('../server/common.js').config();

var Promise = require('bluebird');
var _ = require('underscore');
var clearbit = require('clearbit')(config.clearbitKey);
var db = require('../server/db.js')(config);

var Company = clearbit.Company;
var CronJob = require('cron').CronJob;

var job = new CronJob({
  cronTime: '* * * * *', // At every minute.
  onTick: runScript,
  start: false,
  timeZone: 'America/Los_Angeles'
});
job.start();

function runScript() {
  console.log('================================================');
  console.log('Find companies with incomplete meta data...');
  console.log('================================================');

  db.getCompanies()
  .then(function (companies) {
    console.log('Found: ', companies.length);
    console.log('Start fetching...');
    console.log('________________________________________________');
    return Promise.map(companies, apiLookup);
  })
  .then(function (companiesArray) {
    console.log('________________________________________________');
    console.log('fetched: ', companiesArray.length);
    console.log('Start updating database...');
    console.log('________________________________________________');
    return Promise.each(companiesArray, function (richCompany) {
    console.log('update company: ', richCompany.domain);
      db.updateCompany({
        domain: richCompany.domain
      }, _.pick(richCompany, 'legalName', 'description', 'location', 'foundedDate', 'url'));
    });
  }).catch(function (err) {
    console.log('***=============================================');
    console.log('*** ERROR: ', err);
    console.log('***=============================================');
  }).finally(function () {
    console.log('================================================');
    console.log('Completed without error');
    console.log('================================================');
  });

  function apiLookup(company) {
    console.log('fetching... ', company.domain);
    return Company.find({
      domain: company.domain,
      company_name: company.name
    })
    .catch(Company.QueuedError, function (err) {
      console.log(err); // Company is queued
    })
    .catch(Company.NotFoundError, function (err) {
      console.log(err); // Company could not be found
    })
    .catch(function (err) {
      console.log('Bad/invalid request, unauthorized, Clearbit error, or failed request');
    });
  }
}
