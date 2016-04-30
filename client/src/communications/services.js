// eslint-disable-next-line no-unused-vars
module.exports = function () { // remove comment and use $http later
  var CLIENT_ID = '647322278471-06e71cofl2ddsauer9rtoopfpokgo4pm.apps.googleusercontent.com';
  var SCOPES = ['https://www.googleapis.com/auth/gmail.readonly'];
  var messages = [];

  /* globals gapi */

  var checkAuth = function () {
    return new Promise(function(resolve, reject) {
      gapi.auth.authorize({
        client_id: CLIENT_ID,
        scope: SCOPES.join(' '),
        immediate: false 
      }, resolve );
    });
  };
/**
  * Handle response from authorization server.
  *
  * @param {Object} authResult Authorization result.
  */
 /* function handleAuthResult(authResult) {
    return new Promise(function (resolve) {
      var button = document.getElementById('authorize-div');
      if (authResult && !authResult.error) {
        button.style.display = 'none';
        getEmails().then(function (resp) {
          messages = resp;
          return messages;
        });
      } else {
        button.style.display = 'inline';
      }
    });
  }
  */
/**
  * Load Gmail API client library. List labels once client library
  * is loaded.
  */
  function getMessages() {
    return new Promise(function (resolve) {
      gapi.client.load('gmail', 'v1').then(function () {
        var request = gapi.client.gmail.users.messages.list({
          userId: 'me',
          q: 'from: info@twitter.com',
          maxResults: 10
        });
        request.execute(function (resp) {
          resp.messages.forEach(function (v) {
            var messageRequest = gapi.client.gmail.users.messages.get({
              userId: 'me',
              id: v.id
            });
            messageRequest.execute(function (messageResp) {
              var message = messageResp;
              messages.push(message);
              if (messages.length === resp.messages.length) {
                resolve(messages);
              }
            });
          });
        });
      });
    });
  }


  var getEmails = function (currentCompany) {
    return new Promise(function (resolve) {
      gapi.client.load('gmail', 'v1').then(function () {
        var request = gapi.client.gmail.users.messages.list({
          userId: 'me',
          maxResults: 10,
          q: 'from: ' + currentCompany.name
        });
        request.execute(function (resp) {
          resolve(resp.messages);
        });
      });
    });
  };

  return {
    getEmails: getEmails,
    checkAuth: checkAuth
  };
};
