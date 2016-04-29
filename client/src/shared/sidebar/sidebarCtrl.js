module.exports = function ($scope, Company) {
  $scope.companies = Company.getList;
};
