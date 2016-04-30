module.exports = function ($scope, Comm, currentCompany, emails, $state) {
  // console.log(currentCompany);
  // var theEmails = [];
  $scope.myEmails = emails;
<<<<<<< 0fbebe1f15ec9c1a6c33d2606282ff29bd67aa0f
=======

<<<<<<< b7a5f9ad0c18968c296a9c4de983e8b77dd579bd
>>>>>>> identified issue in data binding
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
=======

  // need to check auth first
  

  // $scope.auth = function() {
  //   console.log('check auth');
  //   Comm.checkAuth().then(function () {
  //     console.log('get emails');
  //     Comm.getEmails(currentCompany).then(function (emails) {
  //       console.log('emails here: ', emails);
  //       $scope.emails = emails;
  //       console.log('$scope.emails ', $scope.emails);
  //     });
  //   });
  // };

  $scope.auth = function () {
    Comm.checkAuth()
    .then(function() {
      console.log('authoized');
      $state.reload();
>>>>>>> identified issue in data binding
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
