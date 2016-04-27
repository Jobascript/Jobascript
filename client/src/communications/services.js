// eslint-disable-next-line no-unused-vars
module.exports = function ($http) { // remove comment and use $http later
  var getEmails = function () {
    var CLIENT_ID = '474025464808-fhpb5lbhf76e1r4jhogdr8e3h8f2lalb.apps.googleusercontent.com';
    var SCOPES = ['https://www.googleapis.com/auth/gmail.compose'];
    
    function checkAuth() {
      gapi.auth.authorize({
          'client_id': CLIENT_ID,
          'scope': SCOPES.join(' '),
          'immediate': true},
           handleAuthResult);
    }


  };

  return {
    getEmails: getEmails
  };
};

<script src="https://apis.google.com/js/client.js?onload=checkAuth"></script>