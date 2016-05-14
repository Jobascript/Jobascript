var Entities = require('html-entities').AllHtmlEntities;
var entities = new Entities();
var moment = require('moment');

module.exports = function () {
  return {
    scope: {
      threadId: '@'
    },
    template: require('./thread.html'),
    controller: function ($scope, GAPI) {
      var gapi = GAPI.getGAPI();

      console.log(gapi);
      // console.log('thred scope ', $scope);
      // GAPI
      // gapi.client.load('gmail', 'v1').then(function () {
        gapi.client.gmail.users.messages.get({
          userId: 'me',
          id: $scope.threadId
        })
        .execute(function (resp) {
          console.log('thread dir', resp);
          $scope.$apply(function () {
            $scope.snippet = entities.decode(resp.snippet);
          });
        });
      // });

      // for each message send id to google

      // resp.messages.forEach(function (v) {
      //   var messageRequest = gapi.client.gmail.users.messages.get({
      //     userId: 'me',
      //     id: v.id
      //   });
      //   messageRequest.execute(function (messageResp) {
      //     // here message is an array
      //     var headers = messageResp.payload.headers;
      //     var message = {};
      //     message.id = v.id;
      //     message.date = getHeader(headers, 'Date');
      //     message.from = getHeader(headers, 'From');
      //     message.subject = getHeader(headers, 'Subject');
      //     // before pushing, extract relevant data to send to view
      //     // here a string is being sent
      //     messages.push(message);
      //     if (messages.length === resp.messages.length) {
      //       resolve(messages);
      //     }
      //   });
      // });
    }
  };
};
