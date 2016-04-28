// eslint-disable-next-line no-unused-vars
module.exports = function ($http) { // remove comment and use $http later
  var CLIENT_ID = '474025464808-fhpb5lbhf76e1r4jhogdr8e3h8f2lalb.apps.googleusercontent.com';
  var SCOPES = ['https://www.googleapis.com/auth/gmail.compose'];

  var checkAuth = function () {
    console.log('sending auth request');
    gapi.auth.authorize({
      client_id: CLIENT_ID,
      scope: SCOPES.join(' '),
      immediate: true }, handleAuthResult);
  };
/**
  * Handle response from authorization server.
  *
  * @param {Object} authResult Authorization result.
  */
  function handleAuthResult(authResult) {
    var authorizeDiv = document.getElementById('authorize-div');
    if (authResult && !authResult.error) {
      // Hide auth UI, then load client library.
      authorizeDiv.style.display = 'none';
      console.log('user has authorized client');
      loadGmailApi();
    } else {
      // Show auth UI, allowing the user to initiate authorization by
      // clicking authorize button.
      console.log('user has not authorized client');
      authorizeDiv.style.display = 'inline';
    }
  }
/**
  * Load Gmail API client library. List labels once client library
  * is loaded.
  */
  function loadGmailApi() {
    console.log('loading gmail api client library');
    gapi.client.load('gmail', 'v1', listLabels);
  }

/**
  * Print all Labels in the authorized user's inbox. If no labels
  * are found an appropriate message is printed.
  */
  function listLabels() {
    console.log('listing label');
    var request = gapi.client.gmail.users.labels.list({
          'userId': 'me'
        });
    request.execute(function (resp) {
      var labels = resp.labels;
      appendPre('Labels:');
      if (labels && labels.length > 0) {
        console.log('has labels');
        for (var i = 0; i < labels.length; i++) {
          var label = labels[i];
          appendPre(label.name);
        }
      } else {
        console.log('has no labels');
        appendPre('No Labels found.');
      }
    });
  }
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
  };

  return {
    getEmails: getEmails,
    checkAuth: checkAuth
  };
};
