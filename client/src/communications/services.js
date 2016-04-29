// eslint-disable-next-line no-unused-vars
module.exports = function () {
  var CLIENT_ID = '647322278471-06e71cofl2ddsauer9rtoopfpokgo4pm.apps.googleusercontent.com';
  var SCOPES = ['https://www.googleapis.com/auth/gmail.readonly'];

  var checkAuth = function () {
    gapi.auth.authorize({
      client_id: CLIENT_ID,
      scope: SCOPES.join(' '),
      immediate: false }, handleAuthResult);
  }


/**
  * Handle response from authorization server.
  *
  * @param {Object} authResult Authorization result.
  */
  function handleAuthResult(authResult) {
    var authorizeDiv = document.getElementById('authorize-div');

    if (authResult && !authResult.error) {
      authorizeDiv.style.display = 'none';
      loadGmailApi().then(function(resp){
        console.log('loading messages: ', resp);
      });
    } else {
      authorizeDiv.style.display = 'inline';
    }
  }

  
/**
  * Loads Gmail API client library. Lists messages once client library
  * is loaded.
  */
  function loadGmailApi() {
    return new Promise(function(resolve, reject) {
      var messages = [];
      console.log('6.success: Request to access gmail api granted')
      gapi.client.load('gmail', 'v1').then(function(){
        console.log('7.success: Building request ')
        var request = gapi.client.gmail.users.messages.list({
          'userId': 'me',
          'labelIds': 'INBOX',
          'maxResults': 10
        });
        request.execute(function(resp) {
          console.log('resp: ', resp);
          resp.messages.forEach(function(v){
            var messageRequest = gapi.client.gmail.users.messages.get({
              'userId': 'me',
              'id': v.id
            });
            messageRequest.execute(function(messageResp) {
             console.log('9.success: message retrieved');
             var message = messageResp;
             console.log("message body: ", message);
             messages.push(message);
             if(messages.length === resp.messages.length) {
              resolve(messages);
             }
            })
          })
        })
      })
    })
  }






  var getEmails = function () {
    return [1, 2, 3, 4];
  };

  return {
    getEmails: getEmails,
    checkAuth: checkAuth
  };
};
