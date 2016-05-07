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
          var messageRequest = gapi.client.gmail.users.messages.get({
            userId: 'me',
            id: $stateParams.message_id
          });
          messageRequest.execute(function (messageResp) {
            if (messageResp) {
              resolve(messageResp);
            } else {
              reject();
            }
          });
        });
      }
    },
    parent: 'comm',
    url: '/messages/:message_id',
    controller: 'CommController',
    template: require('./mail.html')
  });
};
