var inflection = require('inflection');
var _ = require('underscore');

module.exports = function ($scope, $http, Company, companies) {
  $scope.companies = companies;
  $scope.option = [];

  var refreshList = function (id) {
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

  $scope.potentialCompanies = _.debounce(function (companyName) {
    if (companyName === '') {
      $scope.option = [];
    } else {
      $http({
        method: 'GET',
        url: 'https://autocomplete.clearbit.com/v1/companies/suggest?query=' + companyName
      })
      .then(function (resp) {
        $scope.option = resp.data;
        console.log(resp.data);
      });
    }
  });
};
