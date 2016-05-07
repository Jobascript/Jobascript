module.exports = function ($stateProvider) {
  /* globals gapi */
  $stateProvider.state('comm', {
    parent: 'company',
    url: '/communications',
    controller: 'CommController',
    template: require('./comm.html')
  });
  $stateProvider.state('email', {
    resolve: {
      message: function ($stateParams) {
        return new Promise(function (resolve, reject) {
          console.log('in promise');
          var messageRequest = gapi.client.gmail.users.messages.get({
            userId: 'me',
            id: $stateParams.message_id
          });
          console.log(messageRequest);
          messageRequest.execute(function (messageResp) {
              console.log(messageResp);
            if (messageResp) {
              console.log(messageResp);
              resolve(messageResp);
            } else {
              console.log('rejected');
              reject();
            }
          });
        });
      }
    },
    parent: 'comm',
    url: '/messages/:message_id',
    controller: function(message) {
      console.log(message);
    },
    template: require('./mail.html')
  });
};
