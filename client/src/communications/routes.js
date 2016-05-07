module.exports = function ($stateProvider) {
  /* globals gapi */
  $stateProvider
  .state('comm', {
    parent: 'company',
    url: '/communications',
    controller: 'CommController',
    template: require('./comm.html')})
  .state('email', {
    resolve: {
      message: function ($stateParams) {
        return new Promise(function (resolve, reject) {
          console.log('in promise');
          var messageRequest = gapi.client.gmail.users.messages.get({
            userId: 'me',
            id: $stateParams.message_id
          });
          console.log('messageRequest');
          messageRequest.execute(function (messageResp) {
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
    controller: function ($scope, $state, Comm, message) {
    var headers = message.payload.headers;
    var current = {};
    current.date = Comm.getHeader(headers, 'Date');
    current.from = Comm.getHeader(headers, 'From');
    current.subject = Comm.getHeader(headers, 'Subject');
    $scope.message = current;
    },
    template: require('./mail.html')
  });
};
