var inflection = require('inflection');
var _ = require('underscore');
var clearbitUrl = 'https://autocomplete.clearbit.com/v1/companies/suggest';

module.exports = function ($scope, Company, companies, $http) {
  var refreshList;
  $scope.companies = companies;
  $scope.suggestions = [];

  refreshList = function (id) {
    $scope.companyName = '';
    Company.getCompany(id)
    .then(function (newCompany) {
      console.log('new: ', newCompany);
      $scope.companies.unshift(newCompany);
    });
  };

  $scope.addCompany = function (companyName) {
    console.log('to be added: ', companyName);
    Company.addCompany({
      name: inflection.dasherize(angular.lowercase(companyName))
    })
    .then(function (id) {
      console.log(companyName, ' added as id: ', id);
      return id;
    })
    .then(refreshList);
  };

  $scope.findCompanies = _.debounce(function (queryStr) {
    $http.get(clearbitUrl, {
      params: { query: queryStr }
    }).then(function (resp) {
      console.log(resp.data);
      $scope.suggestions = resp.data;
    });
  }, 200);
};
