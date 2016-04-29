var companyHandler = require('./company');
var newsHandler = require('./news');


module.exports = function (app) {
  app.get('/api/company/:id', companyHandler.getCompany);
  app.post('/api/company', companyHandler.addCompany);
  app.delete('/api/company/:id', companyHandler.removeCompany);

  app.get('/api/companies', companyHandler.getCompanies);

  app.get('/api/news', newsHandler);
};
