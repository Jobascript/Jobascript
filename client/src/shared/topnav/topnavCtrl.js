var _ = require('underscore');
var inflection = require('inflection');

module.exports = function ($scope, Company, $state, companies) {
  $scope.suggestions = [];
  $scope.cache = [];
  $scope.isFresh = companies.length === 0;

  // methods
  $scope.suggest = _.debounce(suggestCompanies, 200);
  $scope.clearSuggestions = clearSuggestions;
  $scope.showSuggestions = showSuggestions;
  $scope.navToCompany = navToCompany;

  function navToCompany(company) {
    var currentList = companies;
    var found = _.findLastIndex(currentList, {
      domain: company.domain
    });

    var companyExist = currentList[found];

    // if not found try find it in DB
    if (!companyExist) {
      Company.getCompany(company.domain, true)
      .then(function (dbcompany) {
        console.log('found, ', dbcompany);
        return dbcompany.id;
      }, function () {
        // not found in DB too, add to DB
        // Removing non-alphanumeric chars
        var name = inflection
        .dasherize(
          angular
          .lowercase(company.name)
          .replace(/[^0-9a-zA-Z\s]/g, '')
        );

        angular.extend(company, {
          name: name,
          displayName: company.name
        });

        console.log('not found, adding...', company);
        return Company.addCompany(company);
      }).then(function (id) {
        $state.go('company', { id: id });
      }).catch(function (why) {
        console.log('shit: ', why);
      });
    } else {
      $state.go('company', companyExist, { reload: true });
    }

    $scope.isFresh = false;
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
