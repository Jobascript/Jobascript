module.exports = function ($scope, currentCompany, Company, $state) {
  $scope.company = currentCompany;
  $scope.removeCompany = function () {
    if (confirm('Are you sure?')){ // eslint-disable-line
      Company.deleteCompany(currentCompany.id).then(function () {
        console.log('success');
        $state.go('home', {}, { reload: true });
      });
    }
  };
};

