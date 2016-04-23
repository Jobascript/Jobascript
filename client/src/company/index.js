var company = angular.module('jobascript.company', []);

company.config(function ($urlRouterProvider, $stateProvider) {
  $stateProvider.state('company', {
    parent: 'home',
    url: '/company/:name/:id',
    views: {
      'main@layout': {
        controller: 'CompanyController',
        template: require('./company.html')
      }
    }
  });
});

company.controller('CompanyController', require('./controllers.js'));
company.factory('Company', require('./services.js'));

module.exports = company;
