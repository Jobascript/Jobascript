var companyHandler = require('./company');
var dummydata = require('./dummydata/dummydata.js')
module.exports = function (app) {
  app.get('/company', companyHandler.getCompany);
  app.post('/company', companyHandler.addCompany);
  app.delete('/company', companyHandler.removeCompany);
  
};
