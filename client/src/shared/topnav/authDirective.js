module.exports = function () {
  return {
    template: require('./signup.html'),
    controller: function ($scope) {
      $scope.isOpen = false;
    }
  };
};
