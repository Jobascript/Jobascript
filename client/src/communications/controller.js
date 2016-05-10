module.exports = function ($scope, $state, Comm, currentCompany) {
  console.log(currentCompany);

  var googleScript = document.createElement('script');
  googleScript.setAttribute('src', 'https://apis.google.com/js/client.js');
  googleScript.setAttribute('id', 'onetime');
  if (!document.getElementById('onetime')) {
    document.head.appendChild(googleScript);
  }
  $scope.emails = [];
  $scope.auth = function () {
    console.log('check auth');
    Comm.checkAuth().then(function () {
      console.log('get emails');
      Comm.getEmails(currentCompany).then(function (emails) {
        console.log('emails here: ', emails);
        $scope.$apply(function() {
          $scope.emails = emails;
        });
      });
    });
  };
  $scope.changeState = function (message) {
    $state.go('email');
    console.log(message);
  };
};
