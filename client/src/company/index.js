var company = angular.module('jobascript.company', []);

company.config(require('./routes.js').config);
company.run(require('./routes.js').listen);
company.controller('CompanyController', require('./controller.js'));
company.factory('Company', require('./services.js'));

module.exports = company;
