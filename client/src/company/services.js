module.exports = angular.module('jobascript.company')
.factory('Company', function($http){

	//companyObj comes in form of {name: 'name'}
	var addCompany = function(companyObj){
			return $http({
      		method: 'POST',
      		url: '/api/company'
    	})
    	.then(function(resp){
      		return resp.data;
    	});
	};

	//companyObj comes in form of {id: 'id'}
	var deleteCompany = function(companyObj){
		return $http({
			method: 'DELETE',
			url: '/api/company'
		})
		.then(function(resp){
			return resp.data;
		})
	};

	return {
		addCompany: addCompany,
		deleteCompany: deleteCompany
	};
});


