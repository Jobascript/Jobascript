module.exports = function ($scope, $stateParams) {
  console.log('params: ', $stateParams);
  $scope.companyName = $stateParams.name;
}