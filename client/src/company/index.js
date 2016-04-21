require('./services.js')

var company = angular.module('jobascript.company', []);
// set

company.controller('CompanyController', function($scope, $http, Company){

	$scope.company = '';

	$scope.add = function(companyName){

		Company.addCompany({name: companyName})
	};
});

