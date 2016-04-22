var company = angular.module('jobascript.company', []);

company.config(function($urlRouterProvider, $stateProvider, stateHelperProvider) {

	$stateProvider.state('company', {
		url: '/company/:company',
		controller: 'CompanyController',
		template: require('')
	})
	.state('company.job', {
		url: '/job',
		controller: 'JobController',
		templateUrl: require('')
	})
});

company.controller('CompanyController', function($scope, $http, Company){

	$scope.company = '';

	$scope.add = function(companyName){

		Company.addCompany({name: companyName})
	};
});

company.factory('Company', require('./services.js'));

module.exports = company;



