module.exports = function () {
  var username;

  function init($http) {
    var userObj = {};
    return {
      fetch: getUser,
      currentUser: function () { return userObj; }
    };

    function getUser() {
      var temp = username ? { username: username } : undefined;
      return $http.post('/api/user', temp).then(function (resp) {
        userObj = resp.data;
        console.log('fetch a usr ', userObj);
        return resp.data;
      });
    }
  }

  function setUserName(usernameToSet) {
    username = usernameToSet;
  }

  return {
    $get: init,
    setUserName: setUserName
  };
};
