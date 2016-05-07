module.exports = function () {
  var username;

  function init($http) {
    var userObj = {};
    var companiesList = [];

    function getUser() {
      var userNameOrtemp = username ? { username: username } : undefined;
      var promise;

      if (userObj.username) {
        promise = Promise.resolve(userObj);
      } else {
        promise = $http.post('/api/user', userNameOrtemp)
        .then(function (resp) {
          userObj = resp.data;
          console.log('fetch a usr ', userObj);
          localStorage.setItem('user', userObj.username);
          return resp.data;
        }, function (resp) {
          // 302 (Found) - user already exists
          return (resp.status === 302) ? resp.data : Promise.reject(resp.data);
        });
      }

      return promise;
    }

    function getCompanies() {
      return getUser().then(function (user) {
        return $http.get('/api/user/' + user.id + '/companies')
        .then(function (resp) {
          companiesList = resp.data;
          return resp.data;
        });
      });
    }

    function signup(user) {
      return getUser().then(function (curUser) {
        user.id = curUser.id;
        return $http.post('/api/signup', user);
      });
    }

    return {
      signup: signup,
      getUser: getUser,
      getCompanies: getCompanies,
      companies: function () { return companiesList; }
    };
  }

  function setUsername(usernameToSet) {
    username = usernameToSet;
  }

  return {
    $get: init,
    setUsername: setUsername
  };
};
