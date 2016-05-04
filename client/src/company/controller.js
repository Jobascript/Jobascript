var _ = require('underscore');

module.exports = function ($scope, currentUser, currentCompany, Company, $state) {
  $scope.company = currentCompany;
  $scope.isFollowing = false;

  // var idArray = Company.getList().map(function (com) {
  //   return com.id;
  // });

  // $scope.isFollowing = _(idArray).contains(currentCompany.id);

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
