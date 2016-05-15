var Promise = require('bluebird');
var inflection = require('inflection');
var _ = require('underscore');
var style = require('./getting-started.css');

module.exports = function ($scope, topCompanies, User, Company, $state) {
  $scope.style = style;
  $scope.numOfFollows = '';
  var toFollow = {};
  $scope.topCompanies = topCompanies;
  $scope.getLength = function () {
    return Object.keys(toFollow).length;
  };

  $scope.continue = function () {
    console.log(toFollow);
    User.createTempUser().then(function () {
      return Promise.map(Object.keys(toFollow), function (domain) {
        return Company.follow({ domain: domain });
      });
    })
    .then(function () {
      $state.go('home', {}, { reload: true });
    });
  };

  $scope.toFollow = function (company) {
    var len = Object.keys(toFollow).length;
    if (company.isFollowing) {
      len -= 1;
      company.isFollowing = false;
      delete toFollow[company.domain];
      $scope.numOfFollows = inflection.inflect(len + ' company', Object.keys(toFollow).length);
    } else {
      len += 1;
      company.isFollowing = true;
      toFollow[company.domain] = true;
      $scope.numOfFollows = inflection.inflect(len + ' company', Object.keys(toFollow).length);
    }
    console.log(toFollow);
  };

  $scope.suggest = _.debounce(function (queryStr) {
    if (queryStr === '') {
      return;
    }

    Company.suggest(queryStr)
    .then(function (resp) {
      var suggestedCompanies = resp.data;
      $scope.topCompanies = $scope.topCompanies.filter(function (company) {
        return _.contains(Object.keys(toFollow), company.id); // keep selected companies
      }).concat(suggestedCompanies);
    });
  }, 200);
};

require('./getting-started.css');
