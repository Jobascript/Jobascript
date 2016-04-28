var _ = require('underscore');

module.exports = function ($scope, currentCompany, Company, $state) {
  $scope.company = currentCompany;

  var idArray = Company.getList().map(function (com) {
    return com.id;
  });
  // console.log(Company.getList());

  $scope.isFollowing = _(idArray).contains(currentCompany.id);

  // methods
  $scope.follow = followCompany;
  $scope.unfollow = unfollowCompany;

  function unfollowCompany() {
    // if (confirm('Are you sure?')){ // eslint-disable-line
      Company.unfollow(currentCompany);
      console.log('ctrl ', Company.getList());
      $state.go('company', Company.getList()[0], { reload: false });
    // }
  }

  function followCompany() {
    console.log('follow: ', currentCompany);

    Company.follow(currentCompany);
    console.log(Company.getList());
  }
};

