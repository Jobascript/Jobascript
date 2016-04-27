var config = require('../server/common.js').config();

var Promise = require('bluebird');
var _ = require('underscore');
var clearbit = require('clearbit')(config.clearbitKey);
var db = require('../server/db.js')(config);

var Company = clearbit.Company;

db.getCompanies()
.then(function (companies) {
  return Promise.map(companies, apiLookup);
})
.then(function (companiesArray) {
  // console.log('arrComapy: ', companiesArray);
  return Promise.each(companiesArray, function (richCompany) {
    db.updateCompany({
      domain: richCompany.domain
    }, _.pick(richCompany, 'legalName', 'description', 'location', 'foundedDate', 'url'));
  });
});

function apiLookup(company) {
  // console.log(company.domain);
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