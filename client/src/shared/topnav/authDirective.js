module.exports = function (User) {
  return {
    template: require('./signup.html'),
    controller: function ($scope) {
      $scope.isOpen = false;
      $scope.user = {
        username: '',
        password: ''
      };
      $scope.signup = function () {
        console.log('form submit');
        User.signup($scope.user).then(function (token) {
          console.log('Full user created, token: ', token);
        })
        .catch(function (reason) {
          console.log('login failed: ', reason);
        });
      };
    }
  };
};
