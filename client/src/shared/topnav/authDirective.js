module.exports = function (User) {
  return {
    template: require('./signup-login.html'),
    controller: function ($scope, $state) {
      $scope.isAuth = User.isAuth();
      $scope.isSignupMode = false;
      $scope.isOpen = false;
      $scope.user = {
        username: '',
        password: ''
      };

      $scope.toggleMode = function () {
        $scope.isSignupMode = !$scope.isSignupMode;
      };

      $scope.signupOrLogin = function () {
        console.log('$scope.isSignupMode', $scope.isSignupMode);
        console.log('form submit', $scope.isSignupMode ? 'signup' : 'login');
        if ($scope.isSignupMode) {
          User.signup($scope.user).then(function (token) {
            console.log('Full user created, token: ', token);
            // localStorage.setItem('user', $scope.user.username);
            $scope.user.username = '';
            $scope.user.password = '';
            $state.go($state.current, {}, { reload: true });
            // $scope.isAuth = true;
          })
          .catch(function (reason) {
            console.log('signup failed: ', reason);
          });
        } else {
          login();
        }
      };

      $scope.logout = function () {
        User.logout();
        console.log('logout!');
        $state.go('home', {}, { reload: true });
        // $scope.isAuth = false;
      };

      function login() {
        console.log('logging in...');
        User.login($scope.user)
        .then(function (token) {
          console.log('login succuess', token);
          $state.go($state.current, {}, { reload: true });
        })
        .catch(function (reason) {
          console.log('login fail', reason);
        });
      }
    }
  };
};
