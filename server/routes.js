var auth = require('./auth');
var userHandler = require('./user');
var companyHandler = require('./company');
var newsHandler = require('./news');
var jobHandler = require('./job');

module.exports = function (app) {
  // auth
  app.post('/api/signup', auth.signup); // signup
  app.post('/api/login', auth.login); // login
  app.get('/api/verify/:token', auth.verify); // verify token, return user
  // app.post('');

  // user
  app.post('/api/user', userHandler.createUser);
  app.get('/api/user/:token', auth.verify); // return user

  // users companies
  app.get('/api/user/companies', userHandler.getCompanies);
  // user following and unfollowing
  app.post('/api/user/companies/:company_id', userHandler.followCompany);
  app.delete('/api/user/companies/:company_id', userHandler.unfollowCompany);
  
  // comapany
  app.get('/api/company/:id', companyHandler.getCompany);
  app.post('/api/company', companyHandler.addCompany);
  app.delete('/api/company/:id', companyHandler.removeCompany);
  app.get('/api/companies', companyHandler.getCompanies);
  
  // news
  app.get('/api/news', newsHandler);
  
  // jobs
  app.get('/api/jobs', jobHandler);
};
