var companyHandler = require('./company');

module.exports = function (app) {
  app.get('/api/company/:id', companyHandler.getCompany);
  app.post('/api/company', companyHandler.addCompany);
  app.delete('/api/company/:id', companyHandler.removeCompany);

  app.get('/api/companies', companyHandler.getCompanies);
};
