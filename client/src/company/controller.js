var _ = require('underscore');

module.exports = function ($scope, currentCompany, Company, $state) {
  $scope.company = currentCompany;

  var idArray = Company.getList().map(function (com) {
    return com.id;
  });

  $scope.isFollowing = _(idArray).contains(currentCompany.id);

  // methods
  $scope.follow = followCompany;
  $scope.unfollow = unfollowCompany;

  function unfollowCompany() {
    Company.unfollow(currentCompany);
    $state.go('company', Company.getList()[0], { reload: false });
  }

  function followCompany() {
    Company.follow(currentCompany);
    $scope.isFollowing = true;
  }
};

