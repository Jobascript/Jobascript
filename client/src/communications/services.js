// eslint-disable-next-line no-unused-vars
module.exports = function () { // remove comment and use $http later
  var CLIENT_ID = '647322278471-06e71cofl2ddsauer9rtoopfpokgo4pm.apps.googleusercontent.com';
  var SCOPES = ['https://www.googleapis.com/auth/gmail.readonly'];
  /* globals gapi */
  // ------------------------------------------------
  // --------------- Helper Functions ---------------
  var getHeader = function (headers, headerName) {
    var header = '';
    headers.forEach(function (element) {
      if (element.name === headerName) {
        header = element.value;
      }
    });
    return header;
  };
  // ===============================================
  // ===============================================
  var checkAuth = function () {
    return new Promise(function (resolve) {
      gapi.auth.authorize({
        client_id: CLIENT_ID,
        scope: SCOPES.join(' '),
        immediate: false
      }, resolve);
    });
  };
  var messages = [];
  var getEmails = function (currentCompany) {
    return new Promise(function (resolve) {
      gapi.client.load('gmail', 'v1').then(function () {
        var request = gapi.client.gmail.users.messages.list({
          userId: 'me',
          maxResults: 10,
          q: 'from: ' + currentCompany.name
        });
        request.execute(function (resp) {
          // for each message send id to google
          resp.messages.forEach(function (v) {
            var messageRequest = gapi.client.gmail.users.messages.get({
              userId: 'me',
              id: v.id
            });
            messageRequest.execute(function (messageResp) {
              // here message is an array
              var headers = messageResp.payload.headers;
              var date = getHeader(headers, 'Date');
              var sender = getHeader(headers, 'From');
              var subject = getHeader(headers, 'Subject');
              // before pushing, extract relevant data to send to view

              messages.push('Date: ' + date + ' From: ' + sender + ' Subject: ' + subject);
              if (messages.length === resp.messages.length) {
                resolve(messages);
              }
            });
          });
        });
      });
    });
  };

  return {
    getEmails: getEmails,
    checkAuth: checkAuth
  };
};
