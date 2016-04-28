var _ = require('underscore');
var inflection = require('inflection');

module.exports = function ($scope, Company, $state) {
  $scope.suggestions = [];
  $scope.cache = [];

  // methods
  $scope.suggest = _.debounce(suggestCompanies, 200);
  $scope.clearSuggestions = clearSuggestions;
  $scope.showSuggestions = showSuggestions;
  $scope.addCompany = addCompany;

  function suggestCompanies(queryStr) {
    if (queryStr === '') {
      $scope.suggestions = [];
      return;
    }

    Company.suggest(queryStr)
    .then(function (resp) {
      // var domains = Company.getList().map(function (company) {
      //   return company.domain;
      // });

      // $scope.suggestions = _.reject(resp.data, function (company) {
      //   return _.contains(domains, company.domain);
      // });

      console.log(resp.data);

      $scope.suggestions = resp.data;
    });
  }

  function addCompany(company) {
    console.log('adding: ', company);
    // Removing non-alphanumeric chars
    console.log(company.name);
    var name = inflection.dasherize(angular.lowercase(company.name).replace(/[^0-9a-zA-Z\s]/g, ''));
    angular.extend(company, {
      name: name,
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
    $scope.cache = $scope.suggestions.slice();
    $scope.suggestions = [];
  }

  function showSuggestions() {
    $scope.suggestions = $scope.cache.length ? $scope.cache : [];
  }

  function refreshList() {
    $scope.companyName = '';
    $state.reload();
  }
};
