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
      } else if (token) {
        promise = fetchUserByToken(token);
      } else {
        promise = createTempUser();
      }

      return promise;
    }

    function createTempUser() {
      return $http.post('/api/user')
      .then(function (resp) {
        userObj = resp.data;
        console.log('created a temp usr: ', userObj);
        return resp.data;
      }, function (resp) {
        // 302 (Found) - user already exists
        return (resp.status === 302) ? resp.data : Promise.reject(resp.data);
      })
      .catch(function (reason) {
        console.log('failed creating a new user: ', reason);
        return reason;
      });
    }

    function fetchUserByToken(userToken) {
      return $http.get('/api/verify/' + userToken)
      .then(function (resp) {
        return resp.data;
      });
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
        return $http.post('/api/signup', user)
        .then(function (resp) {
          localStorage.setItem('token', resp.data);
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
        localStorage.setItem('token', resp.data);
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
