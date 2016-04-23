var company = angular.module('jobascript.company', []);

company.config(require('./routes.js'));
company.controller('CompanyController', require('./controllers.js'));
company.factory('Company', require('./services.js'));

module.exports = company;
