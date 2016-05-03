var companyHandler = require('./company');
var newsHandler = require('./news');
var jobHandler = require('./job');
module.exports = function (app) {
  app.get('/api/company/:id', companyHandler.getCompany);
  app.post('/api/company', companyHandler.addCompany);
  app.delete('/api/company/:id', companyHandler.removeCompany);
  app.get('/api/companies', companyHandler.getCompanies);
  app.get('/api/news', newsHandler);
  app.get('/api/jobs', jobHandler.getJobs);
  app.get('/api/job', jobHandler.getJobListing);
};
