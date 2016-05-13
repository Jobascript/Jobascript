module.exports = function () {
  return {
    scope: {
      threadId: '@'
    },
    template: require('./thread.html'),
    controller: function ($scope, GAPI) {
      console.log('thred scope ', $scope);
      // GAPI
    }
  };
};
