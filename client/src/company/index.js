var company = angular.module('jobascript.company', []);

company.config(function($urlRouterProvider, $stateProvider, stateHelperProvider) {

	$stateProvider.state('company', {})
	.state('company.job', {
		url: '/job',
		controller: 'JobController',
		templateUrl: '../job/job.html'
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



