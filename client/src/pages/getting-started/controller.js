var Promise = require('bluebird');
var inflection = require('inflection');

module.exports = function ($scope, topCompanies, User, Company, $state) {
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
      // $scope.numOfFollows -= 1;
    } else {
      len += 1;
      company.isFollowing = true;
      toFollow[company.id] = true;
      $scope.numOfFollows = inflection.inflect(len + ' company', Object.keys(toFollow).length);
      // $scope.numOfFollows += 1;
    }
  };

  $scope.searchCompanies = function () {

  };
};

require('./getting-started.css');
