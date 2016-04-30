// eslint-disable-next-line no-unused-vars
module.exports = function () { // remove comment and use $http later

  var CLIENT_ID = '647322278471-06e71cofl2ddsauer9rtoopfpokgo4pm.apps.googleusercontent.com';
  var SCOPES = ['https://www.googleapis.com/auth/gmail.readonly'];
  var messages = [];

  var checkAuth = function () {
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
    console.log('4: Auth Result: ', authResult);

    var button = document.getElementById('authorize-div');

    if (authResult && !authResult.error) {
      // Hide auth UI, then load client library.
      button.style.display = 'none';
      console.log('4.success: User has authorized client');
      // If a callback is not provided, a promise is returned.
      console.log('5.success: Loading the client library interface to Gmail API')
      getMessages().then(function(resp){
        messages = resp;
        console.log('loading messages array', messages);
        return messages;
      });
      console.log('Loading call has returned')
    } else {
      // Show auth UI, allowing the user to initiate authorization by
      // clicking authorize button.
      console.log('4.fail: User has not authorized client');
      console.log('Should redirect to a login portal');
      button.style.display = 'inline';
    }
  }
/**
  * Load Gmail API client library. List labels once client library
  * is loaded.
  */
  function getMessages() {
    return new Promise(function(resolve, reject) {
      var messages = [];
      console.log('6.success: Request to access gmail api granted')
      gapi.client.load('gmail', 'v1').then(function(){
        console.log('7.success: Building request ')
        var request = gapi.client.gmail.users.messages.list({
          'userId': 'me',
          'q': 'from: info@twitter.com',
          'maxResults': 10
        });
        console.log('request: ', request);
        request.execute(function(resp) {
        console.log('8.success: sending request');


        resp.messages.forEach(function(v){
          var messageRequest = gapi.client.gmail.users.messages.get({
            'userId': 'me',
            'id': v.id
          });
          messageRequest.execute(function(messageResp) {
           var message = messageResp;
           messages.push(message);
           if(messages.length === resp.messages.length) {
            resolve(messages);
           }
          })


        })
        })
      });
    });
  }


  var getEmails = function (currentCompany) {
    return new Promise(function(resolve, reject) {
      gapi.client.load('gmail', 'v1').then(function() {
        var request = gapi.client.gmail.users.messages.list({
          'userId': 'me',
          'maxResults': 10,
          'q': 'from: ' + currentCompany.name
        });
        request.execute(function(resp) {
          resolve(resp);
        });
      })
    })
  };

  return {
    getEmails: getEmails,
    checkAuth: checkAuth
  };
};
