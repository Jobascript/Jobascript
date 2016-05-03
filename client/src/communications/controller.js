module.exports = function ($scope, Comm, currentCompany, emails, $state) {
  // console.log(currentCompany);
  // var theEmails = [];
  $scope.myEmails = emails;
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
        $scope.emails = emails;
      });
    });
  };

  $scope.getEmails = function () {
    Comm.getEmails(currentCompany).then(function (emails) {
      console.log('b ', $scope.myEmails);
      updateEmails(emails);
      console.log('a ', $scope.myEmails);
    });
  };

  function updateEmails(emails) {
    $scope.myEmails = emails;
  }
};
