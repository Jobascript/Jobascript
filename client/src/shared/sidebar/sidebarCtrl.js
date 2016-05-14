var style = require('./sidebar.css');

module.exports = function ($scope, $filter, companies) {
  var orderBy = $filter('orderBy');

  $scope.style = style;
  $scope.companies = companies;

  $scope.reverses = {
    name: false,
    followed_on: false
  };

  $scope.sortBy = function (predicate) {
    $scope.reverses[predicate] = !$scope.reverses[predicate];
    $scope.predicate = predicate;
    $scope.companies = orderBy($scope.companies, predicate, $scope.reverses[predicate]);
  };

  $scope.sortBy('followed_on', true);
};
