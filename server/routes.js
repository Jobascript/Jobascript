var auth = require('./auth');
var userHandler = require('./user');
var companyHandler = require('./company');
var newsHandler = require('./news');
var jobHandler = require('./job');

module.exports = function (app) {
  // auth
  app.post('/api/signup', auth.signup); // signup
  app.post('/api/login', auth.login); // login
  app.get('/api/verify/:token', auth.verify); // verify token
  
  // user
  app.post('/api/user', userHandler.createUser);
  // get without param will create new user
  // get with param will retreive user

  // users companies
  app.get('/api/user/:user_id/companies', userHandler.getCompanies);
  // user following and unfollowing
  app.post('/api/user/:user_id/companies/:company_id', userHandler.followCompany);
  app.delete('/api/user/:user_id/companies/:company_id', userHandler.unfollowCompany);

  app.get('/api/company/:id', companyHandler.getCompany);
  app.post('/api/company', companyHandler.addCompany);
  app.delete('/api/company/:id', companyHandler.removeCompany);
  app.get('/api/companies', companyHandler.getCompanies);

  app.get('/api/news', newsHandler);

  app.get('/api/jobs', jobHandler);
};
