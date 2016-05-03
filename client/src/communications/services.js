// eslint-disable-next-line no-unused-vars
module.exports = function () { // remove comment and use $http later
  var CLIENT_ID = '647322278471-06e71cofl2ddsauer9rtoopfpokgo4pm.apps.googleusercontent.com';
  var SCOPES = ['https://www.googleapis.com/auth/gmail.readonly'];
  /* globals gapi */
  var checkAuth = function () {
    return new Promise(function (resolve) {
      gapi.auth.authorize({
        client_id: CLIENT_ID,
        scope: SCOPES.join(' '),
        immediate: false
      }, resolve);
    });
  };
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
