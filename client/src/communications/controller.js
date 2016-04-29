module.exports = function ($scope, Comm, currentCompany) {
  console.log(currentCompany);
  $scope.runScript = (function() {
    var googleScript = document.createElement('script');
    googleScript.setAttribute('src', 'https://apis.google.com/js/client.js');
    googleScript.setAttribute('id', 'onetime');

    if(!document.getElementById('onetime')){
      document.head.appendChild(googleScript);
    }
  })();

  $scope.emails = Comm.getEmails();
  $scope.auth = Comm.checkAuth;
  
};
