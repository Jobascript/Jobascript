var _ = require('underscore');
var inflection = require('inflection');

module.exports = function ($scope, Company, $state) {
  $scope.suggestions = [];
  $scope.cache = [];

  // methods
  $scope.suggest = _.debounce(suggestCompanies, 200);
  $scope.clearSuggestions = clearSuggestions;
  $scope.showSuggestions = showSuggestions;
  $scope.navToCompany = navToCompany;

  function navToCompany(company) {
    var currentList = Company.getList();
    var found = _.findLastIndex(currentList, {
      domain: company.domain
    });

    var companyExist = currentList[found];

    // if not found try add to DB
    if (!companyExist) {

      // Removing non-alphanumeric chars
      var name = inflection.dasherize(angular.lowercase(company.name).replace(/[^0-9a-zA-Z\s]/g, ''));
      angular.extend(company, {
        name: name,
        displayName: company.name
      });

      Company.addCompany(company)
      .then(function (id) {
        $state.go('company', { id: id });
      });

    } else {
      $state.go('company', companyExist);
    }

    $scope.companyName = '';
    clearSuggestions(false);
  }

  function suggestCompanies(queryStr) {
    if (queryStr === '') {
      $scope.suggestions = [];
      return;
    }

    Company.suggest(queryStr)
    .then(function (resp) {
      $scope.suggestions = resp.data;
    });
  }

  function clearSuggestions(cache) {
    var doCache = cache !== undefined || true;
    if (doCache) {
      console.log('save Cache');
      $scope.cache = $scope.suggestions.slice();
    }
    $scope.suggestions = [];
  }

  function showSuggestions() {
    $scope.suggestions = $scope.cache.length ? $scope.cache : [];
  }
};
