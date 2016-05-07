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
    controller: function ($scope, $state, message) {
      $scope.changeState = function () {
        $state.go('email', message);
      };
    },
    template: require('./mail.html')
  });
};
