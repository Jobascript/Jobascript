var company = angular.module('jobascript.company', []);

company.config(function ($urlRouterProvider, $stateProvider) {
  $stateProvider.state('company', {
    url: '/company/:company',
    controller: 'CompanyController',
    template: require('./company.html')
  });
});

company.factory('Company', require('./services.js'));

module.exports = company;
