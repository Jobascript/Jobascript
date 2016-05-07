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
          console.log('new promise');
          var messageRequest = gapi.client.gmail.users.messages.get({
            userId: 'me',
            id: $stateParams.message_id
          });
          messageRequest.execute(function (messageResp) {
            if (messageResp) {
              console.log('promise resolved');
              resolve(messageResp);
            } else {
              console.log('promise rejected');
              reject();
            }
          });
        });
      }
    },
    parent: 'comm',
    url: '/messages/:message_id',
    controller: function ($scope, $state, Comm, message) {
    var current = {};
    console.log('message: ', message);
    var headers = message.payload.headers;
    var body = message.result.payload.parts[1];
    console.log('body: ', body);
    var bodydata = body.body.data;
    var finalbodydata = bodydata.replace(/-/g, '+').replace(/_/g, '/').replace(/\s/g, '');
    var realfinalbodydata = decodeURIComponent(escape(window.atob(finalbodydata)));
    console.log(realfinalbodydata);
    current.date = Comm.getHeader(headers, 'Date');
    current.from = Comm.getHeader(headers, 'From');
    current.subject = Comm.getHeader(headers, 'Subject');
    current.body = realfinalbodydata;
    $scope.message = current;
    },
    template: require('./mail.html')
  });
};
