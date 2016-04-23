var company = angular.module('jobascript.company', []);


company.config(require('./routes.js'));
company.controller('CompanyController', require('./controller.js'));

company.config(function($urlRouterProvider, $stateProvider) {

	// $stateProvider.state('company', {
	// 	url: '/company/:company',
	// 	controller: 'CompanyController',
	// 	template: require('')
	// })
	// .state('company.job', {
	// 	url: '/job',
	// 	controller: 'JobController',
	// 	template: require('')
	// })
});

company.controller('CompanyController', function($scope, $http, Company){

	$scope.company = '';
	$scope.companyN = '';

	$scope.add = function(companyObj){

		// console.log(Company.addCompany({name: companyName}))
		// .then(function(data){
		// 	console.log(data)
		// })
		Company.addCompany({name: companyObj})
		.then(function(data){
			console.log(data);
		});
	};

	$scope.get = function(companyObj){
		Company.getCompany({name: companyObj})
		.then(function(data){
			console.log(data);
		});
	};
});


company.factory('Company', require('./services.js'));

module.exports = company;
