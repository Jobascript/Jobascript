var inflection = require('inflection');
var _ = require('underscore');
var clearbitUrl = 'https://autocomplete.clearbit.com/v1/companies/suggest';

module.exports = function ($scope, Company, companies, $http) {
  $scope.companies = companies;
  $scope.suggestions = [];

  var findCompanies = _.debounce(function (queryStr) {
    if (!queryStr) {
      $scope.suggestions = [];
      return;
    }

    $http.get(clearbitUrl, {
      params: { query: queryStr }
    }).then(function (resp) {
      var domains = $scope.companies.map(function (company) {
        return company.domain;
      });

      $scope.suggestions = _.reject(resp.data, function (company) {
        return _.contains(domains, company.domain);
      });
    });
  }, 200);

  function addCompany(company) {
    console.log('adding: ', company);
    angular.extend(company, {
      name: inflection.dasherize(angular.lowercase(company.name)),
      displayName: company.name
    });

    console.log('to be added: ', company);

    Company.addCompany(company)
    .then(function (id) {
      console.log(company.name, ' added as id: ', id);
      return id;
    })
    .then(refreshList)
    .then(function () {
      $scope.suggestions = [];
    });
  }

  function refreshList(id) {
    $scope.companyName = '';
    console.log(id);
    Company.getCompany(id)
    .then(function (newCompany) {
      console.log('new: ', newCompany);
      $scope.companies.unshift(newCompany);
    });
  }

  $scope.findCompanies = findCompanies;
  $scope.addCompany = addCompany;
};
