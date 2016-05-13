// var CLIENT_ID = '647322278471-06e71cofl2ddsauer9rtoopfpokgo4pm.apps.googleusercontent.com';
var CLIENT_ID = '378952285896-tlt8i2f17edieb5kl2mmsfl7miccetbg.apps.googleusercontent.com';
var SCOPES = ['https://www.googleapis.com/auth/gmail.readonly'];

module.exports = function ($scope, $state, currentCompany, gapi) {
  $scope.isAuth = false;
  $scope.emails = [];

  $scope.connect = handleAuthClick;

  checkAuth();

  function checkAuth() {
    gapi.auth.authorize({
      client_id: CLIENT_ID,
      scope: SCOPES,
      immediate: true
    }, handleAuthResult);
  }

  function handleAuthResult(authResult) {
    $scope.$apply(function () {
      if (authResult && !authResult.error) {
        $scope.isAuth = true;
        makeApiCall();
      } else {
        $scope.isAuth = false;
        console.log('not auth yet');
      }
    });
  }

  function handleAuthClick() {
    gapi.auth.authorize({
      client_id: CLIENT_ID,
      scope: SCOPES,
      immediate: false
    }, handleAuthResult);

    return false;
  }

  function makeApiCall() {
    console.log('authed, call sth');
    gapi.client.load('gmail', 'v1')
    .then(function () {
      console.log('gmail api loaded');
      return;
    })
    .then(function () {
      var request = gapi.client.gmail.users.messages.list({
        userId: 'me',
        maxResults: 10,
        q: 'from: ' + currentCompany.name
      });
      request.execute(function (resp) {
        console.log(resp);
        if (resp.resultSizeEstimate !== 0) {
          $scope.$apply(function () {
            $scope.emails = resp.messages;
          });
        }

        // for each message send id to google

        // resp.messages.forEach(function (v) {
        //   var messageRequest = gapi.client.gmail.users.messages.get({
        //     userId: 'me',
        //     id: v.id
        //   });
        //   messageRequest.execute(function (messageResp) {
        //     // here message is an array
        //     var headers = messageResp.payload.headers;
        //     var message = {};
        //     message.id = v.id;
        //     message.date = getHeader(headers, 'Date');
        //     message.from = getHeader(headers, 'From');
        //     message.subject = getHeader(headers, 'Subject');
        //     // before pushing, extract relevant data to send to view
        //     // here a string is being sent
        //     messages.push(message);
        //     if (messages.length === resp.messages.length) {
        //       resolve(messages);
        //     }
        //   });
        // });
      });
    });
  }
};
