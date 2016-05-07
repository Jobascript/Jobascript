module.exports = function () {
  var username = null;
  var token = null;

  return {
    $get: init,
    setUsername: setUsername,
    setToken: setToken
  };

  function init($http) {
    var userObj = null;
    var companiesList = [];

    return {
      isAuth: function () { return !!token; },
      signup: signup,
      login: login,
      logout: logout,
      getUser: getUser,
      getCompanies: getCompanies,
      companies: function () { return companiesList; }
    };

    function getUser() {
      var promise;

      if (userObj) {
        promise = Promise.resolve(userObj);
      } else {
        if(token) {
          login();
        }
        // var userNameOrtemp = username ? { username: username } : undefined;
        // promise = $http.post('/api/user', userNameOrtemp)
        // .then(function (resp) {
        //   userObj = resp.data;
        //   console.log('fetch a usr ', userObj);
        //   localStorage.setItem('user', userObj.username);
        //   return resp.data;
        // }, function (resp) {
        //   // 302 (Found) - user already exists
        //   return (resp.status === 302) ? resp.data : Promise.reject(resp.data);
        // });
      }

      return promise;
    }

    // function fetchUser(token) {
    //   return $http.get('/api/user')
    // }

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
        return $http.post('/api/signup', user)
        .then(function (resp) {
          return resp.data;
        });
      });
    }

    function logout() {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    }

    function login(user) {
      return $http.post('/api/login', user)
      .then(function (resp) {
        return resp.data;
      });
    }
  }

  function setUsername(usernameToSet) {
    username = usernameToSet;
  }

  function setToken(tokenToSet) {
    token = tokenToSet;
  }
};
