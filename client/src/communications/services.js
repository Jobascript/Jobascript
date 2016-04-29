// eslint-disable-next-line no-unused-vars
module.exports = function ($http) { // remove comment and use $http later
  var CLIENT_ID = '647322278471-06e71cofl2ddsauer9rtoopfpokgo4pm.apps.googleusercontent.com';
  var SCOPES = ['https://www.googleapis.com/auth/gmail.compose'];

  var checkAuth = function () {
    console.log('1: Initiating auth process');
    console.log('2: Requesting authorization status from google');
    gapi.auth.authorize({
      client_id: CLIENT_ID,
      scope: SCOPES.join(' '),
      immediate: false }, handleAuthResult);
  };
/**
  * Handle response from authorization server.
  *
  * @param {Object} authResult Authorization result.
  */
  function handleAuthResult(authResult) {
    console.log('3: Authorization status result received');

    var authorizeDiv = document.getElementById('authorize-div');
    if (authResult && !authResult.error) {
      // Hide auth UI, then load client library.
      authorizeDiv.style.display = 'none';
      console.log('4.success: User has authorized client');
      // If a callback is not provided, a promise is returned.
      console.log('5.success: Loading the client library interface to Gmail API')
      loadGmailApi();
      console.log('Loading call has returned')
    } else {
      // Show auth UI, allowing the user to initiate authorization by
      // clicking authorize button.
      console.log('4.fail: User has not authorized client');
      console.log('Should redirect to a login portal');
      authorizeDiv.style.display = 'inline';
    }
  }
/**
  * Load Gmail API client library. List labels once client library
  * is loaded.
  */
  function loadGmailApi() {
    console.log('6.success: Request to access gmail api granted')
    gapi.client.load('gmail', 'v1').then(function(){
      console.log('7.success: Building request ')
      var request = gapi.client.gmail.users.messages.list({
        'userId': 'me'
      });
      console.log('request: ', request);
      request.then(function(resp) {
      console.log('8.success: sending request');
      console.log('resp: ', resp);
      })
    });
    //gapi.client.load('gmail', 'v1', listMessages('me', 'github', appendPre));
  }


  // function listMessages(userId, query, callback) {
  //   console.log('inside list messages');
  //   // what is the format of result?
  //   var getPageOfMessages = function (request, result) {
  //     console.log('inside getPageofMessages');
  //     request.execute(function (resp) {
  //       result = result.concat(resp.messages);
  //       var nextPageToken = resp.nextPageToken;
  //       if (nextPageToken) {
  //         request = gapi.client.gmail.users.messages.list({
  //           userId: userId,
  //           pageToken: nextPageToken,
  //           q: query
  //         });
  //         getPageOfMessages(request, result);
  //       } else {
  //         callback(result);
  //       }
  //     });
  //   };
  //   var initialRequest = gapi.client.gmail.users.messages.list({
  //     user: userId,
  //     q: query
  //   });
  //   getPageOfMessages(initialRequest, []);
  // }
/**
  * Print all Labels in the authorized user's inbox. If no labels
  * are found an appropriate message is printed.
  */
  // function listLabels() {
  //   console.log('listing label');
  //   var request = gapi.client.gmail.users.labels.list({
  //         'userId': 'me'
  //       });
  //   request.execute(function (resp) {
  //     var labels = resp.labels;
  //     appendPre('Labels:');
  //     if (labels && labels.length > 0) {
  //       console.log('has labels');
  //       for (var i = 0; i < labels.length; i++) {
  //         var label = labels[i];
  //         appendPre(label.name);
  //       }
  //     } else {
  //       console.log('has no labels');
  //       appendPre('No Labels found.');
  //     }
  //   });
  // }
/**
  * Append a pre element to the body containing the given message
  * as its text node.
  *
  * @param {string} message Text to be placed in pre element.
  */
  function appendPre(message) {
    var pre = document.getElementById('output');
    var textContent = document.createTextNode(message + '\n');
    pre.appendChild(textContent);
  }

  var getEmails = function () {
    return [1, 2, 3, 4];
  };

  return {
    getEmails: getEmails,
    checkAuth: checkAuth
  };
};
