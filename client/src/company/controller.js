module.exports = function ($scope, currentCompany, Company, $state) {
  $scope.company = currentCompany;

  // methods
  $scope.follow = followCompany;
  $scope.unfollow = unfollowCompany;

  function unfollowCompany() {
    Company.unfollow(currentCompany).then(function () {
      $state.reload();
    });
  }

  function followCompany() {
    Company.follow(currentCompany).then(function () {
      $state.reload();
    });
  }
};
