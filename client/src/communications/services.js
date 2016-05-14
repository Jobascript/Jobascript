// eslint-disable-next-line no-unused-vars
module.exports = function () {
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

  var getHTMLPart = function (arr) {
    for (var x = 0; x <= arr.length; x++) {
      if (typeof arr[x].parts === 'undefined') {
        if (arr[x].mimeType === 'text/html') {
          return arr[x].body.data;
        }
      } else {
        return getHTMLPart(arr[x].parts);
      }
    }
    return '';
  };
  var getBody = function (message) {
    var encodedBody = '';
    if (typeof message.parts === 'undefined') {
      encodedBody = message.body.data;
    } else {
      encodedBody = getHTMLPart(message.parts);
    }
    encodedBody = encodedBody.replace(/-/g, '+').replace(/_/g, '/')
    .replace(/\s/g, '');
    return decodeURIComponent(escape(window.atob(encodedBody)));
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
              var message = {};
              message.id = v.id;
              message.date = getHeader(headers, 'Date');
              message.from = getHeader(headers, 'From');
              message.subject = getHeader(headers, 'Subject');
              // before pushing, extract relevant data to send to view
              // here a string is being sent
              messages.push(message);
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
    checkAuth: checkAuth,
    getHeader: getHeader,
    getBody: getBody,
    getHTMLPart: getHTMLPart
  };
};
