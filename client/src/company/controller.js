module.exports = function ($scope, currentUser, currentCompany, Company, $state) {
  $scope.company = currentCompany;

  // methods
  $scope.follow = followCompany;
  $scope.unfollow = unfollowCompany;

  function unfollowCompany() {
    Company.unfollow(currentCompany, currentUser).then(function () {
      $state.reload();
    });
  }

  function followCompany() {
    Company.follow(currentCompany, currentUser).then(function () {
      $state.reload();
    });
  }
};
