module.exports = function (User) {
  return {
    template: require('./signup-login.html'),
    controller: function ($scope, $state, ngToast) {
      $scope.isSignupMode = false;
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
            ngToast.success('<strong>signup succuess:</strong> Welcome ' +
                            $scope.user.username + '!');
            $state.go($state.current, {}, { reload: true });
          })
          .catch(function (reason) {
            console.log('signup failed: ', reason);
            ngToast.danger('<strong>signup failed:</strong> ' +
                           reason.data || reason.statusText || reason);
          });
        } else {
          login();
        }
      };

      $scope.logout = function () {
        User.logout();
        console.log('logout!');
        ngToast.info('<strong>logout</strong>');
        $state.go('start');
      };

      function login() {
        console.log('logging in...');
        User.login($scope.user)
        .then(function (token) {
          ngToast.success('<strong>login succuess</strong> Welcome back, '
                          + $scope.user.username + '!');
          console.log('login succuess', token);
          if ($state.current.name === 'company') {
            $state.go($state.current, {}, { reload: true });
          } else {
            $state.go('home', {}, { reload: true });
          }
        })
        .catch(function (reason) {
          ngToast.danger('<strong>login failed:</strong> ' +
                         reason.data || reason.statusText || reason);
          console.log('login fail', reason);
        });
      }
    }
  };
};
