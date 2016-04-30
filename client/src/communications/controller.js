module.exports = function ($scope, Comm, currentCompany) {
  console.log(currentCompany);

  var googleScript = document.createElement('script');
  googleScript.setAttribute('src', 'https://apis.google.com/js/client.js');
  googleScript.setAttribute('id', 'onetime');
  if (!document.getElementById('onetime')) {
    document.head.appendChild(googleScript);
  }

  $scope.emails = [];
  Comm.getEmails(currentCompany).then(function (emails) {
    $scope.emails = emails;
  });

  $scope.auth = Comm.checkAuth;
};
