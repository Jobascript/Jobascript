var Entities = require('html-entities').AllHtmlEntities;
var entities = new Entities();
var moment = require('moment');

module.exports = function () {
  return {
    scope: {
      threadId: '='
    },
    template: require('./thread.html'),
    controller: function ($scope, GAPI) {
      var gapi = GAPI.getGAPI();

      gapi.client.gmail.users.messages.get({
        userId: 'me',
        id: $scope.threadId
      })
      .execute(function (resp) {
        $scope.$apply(function () {
          $scope.snippet = entities.decode(resp.snippet);
          $scope.date = moment(Number(resp.internalDate)).fromNow();
        });
      });
    }
  };
};
