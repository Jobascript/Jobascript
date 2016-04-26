var inflection = require('inflection');
var _ = require('underscore');
var clearbitUrl = 'https://autocomplete.clearbit.com/v1/companies/suggest';

module.exports = function ($scope, Company, companies, $http, $state) {
  $scope.companies = companies;
  $scope.suggestions = [];

  // methods
  $scope.findCompanies = _.debounce(findCompanies, 200);
  $scope.addCompany = addCompany;

  function findCompanies(queryStr) {
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
  }

  function addCompany(company) {
    console.log('adding: ', company);
    var name = inflection.dasherize(angular.lowercase(company.name));
    angular.extend(company, {
      name: name.split('.').join(''), // to remove dots
      displayName: company.name
    });

    console.log('to be added: ', company);

    Company.addCompany(company)
    .then(function (id) {
      console.log(company.name, ' added as id: ', id);
      return id;
    })
    .then(refreshList)
    .then(clearSuggestions);
  }

  function clearSuggestions() {
    $scope.suggestions = [];
  }

  function refreshList() {
    $scope.companyName = '';
    $state.reload();
  }
};
