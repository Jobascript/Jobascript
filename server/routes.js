var companyHandler = require('./company/');
var jobHandler = require('./job/');

module.exports = function(app) {
  app.get('/company', companyHandler.getCompany);
  app.post('/company', companyHandler.addCompany);
  app.delete('/company', companyHandler.removeCompany);
};
