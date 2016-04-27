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

// runScript();

function runScript() {
  console.log('================================================');
  console.log('Find companies with incomplete meta data...');
  console.log('================================================');

  db.getCompanies({
    filter: {
      description: null
    }
  })
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

    return Promise.map(companiesArray, function (richCompany) {
      var columns = _.chain(richCompany)
                    .pick('legalName', 'description', 'location', 'foundedDate', 'url', 'domain')
                    .pick(function (value) {
                      return value !== null;
                    }).value();

      return db.updateCompany({
        id: richCompany.id
      }, columns)
      .then(() => {
        console.log(richCompany.name, ' updated');
      })
      .catch(function (reason) {
        console.log('update ' + richCompany.domain + ' fail: ', reason);
        throw new Error(reason);
      });
    }).then(changesArr => {
      console.log('________________________________________________');
      console.log('updated ' + changesArr.length + ' companies');
    });
  })
  .then(function () {
    console.log('================================================');
    console.log('Completed without error');
    console.log('================================================');
  })
  .catch(function (err) {
    console.log('***=============================================');
    console.log('*** ERROR: ', err);
    console.log('***=============================================');
  });

  function apiLookup(company) {
    console.log('fetching... ', company.name);

    return Company.find({
      domain: company.domain,
      company_name: company.name
    })
    .then(function (richCompany) {
      var comWithID = richCompany;
      comWithID.id = company.id; // replace company id with our own
      return comWithID;
    })
    .catch(Company.QueuedError, function (err) {
      console.log(err); // Company is queued
    })
    .catch(Company.NotFoundError, function (err) {
      console.log(err); // Company could not be found
    })
    .catch(function (err) {
      console.log('Bad/invalid request, unauthorized, Clearbit error, or failed request');
      console.log(err);
    });
  }
}
