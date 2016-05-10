var Promise = require('bluebird');

module.exports = function ($scope, topCompanies, Company, $state) {
  var toFollow = {};
  $scope.topCompanies = topCompanies;
  $scope.continue = function () {
    console.log(toFollow);
    Promise.map(Object.keys(toFollow), function (id) {
      return Company.follow({ id: id });
    })
    .then(function () {
      $state.go('home', {}, {reload: true});
    });
  };

  $scope.toFollow = function (company) {
    if (company.isFollowing) {
      company.isFollowing = false;
      delete toFollow[company.id];
    } else {
      company.isFollowing = true;
      toFollow[company.id] = true;
    }
  };
};

require('./getting-started.css');
