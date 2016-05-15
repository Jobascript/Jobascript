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
      return Promise.map(Object.keys(toFollow), function (id) {
        return Company.follow({ id: id });
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
      delete toFollow[company.id];
      $scope.numOfFollows = inflection.inflect(len + ' company', Object.keys(toFollow).length);
    } else {
      len += 1;
      company.isFollowing = true;
      toFollow[company.id] = true;
      $scope.numOfFollows = inflection.inflect(len + ' company', Object.keys(toFollow).length);
    }
  };

  $scope.suggest = _.debounce(function (queryStr) {
    if (queryStr === '') {
      return;
    }

    Company.suggest(queryStr)
    .then(function (resp) {
      $scope.topCompanies = resp.data;
    });
  }, 200);
};

require('./getting-started.css');
