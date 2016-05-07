module.exports = function (User, $state) {
  return {
    template: require('./signup.html'),
    controller: function ($scope) {
      $scope.isAuth = User.isAuth();
      $scope.isSignupMode = false;
      $scope.isOpen = false;
      $scope.user = {
        username: '',
        password: ''
      };
      $scope.signup = function () {
        console.log('form submit');
        if (!$scope.isSignupMode) {
          $scope.login();
          return;
        }
        User.signup($scope.user).then(function (token) {
          console.log('Full user created, token: ', token);
          localStorage.setItem('token', token);
          localStorage.setItem('user', $scope.user.username);
          $scope.user.username = '';
          $scope.user.password = '';
          // $state.reload();
          $scope.isAuth = true;
        })
        .catch(function (reason) {
          console.log('login failed: ', reason);
        });
      };

      $scope.logout = function () {
        User.logout();
        // $state.reload();
        $scope.isAuth = false;
      };

      $scope.login = function () {
        console.log('logging in...');
        User.login($scope.user)
        .then(function (token) {
          console.log('login succuess', token);
        })
        .catch(function () {
          console.log('login fail');
        });
      };
    }
  };
};
