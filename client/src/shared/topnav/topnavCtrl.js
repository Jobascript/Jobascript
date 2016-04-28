var _ = require('underscore');
var inflection = require('inflection');

module.exports = function ($scope, Company, $state) {
  $scope.suggestions = [];
  $scope.cache = [];

  // methods
  $scope.suggest = _.debounce(suggestCompanies, 200);
  $scope.clearSuggestions = clearSuggestions;
  $scope.showSuggestions = showSuggestions;

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
