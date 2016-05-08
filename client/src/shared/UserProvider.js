module.exports = function () {
  var TOKEN = null;

  return {
    $get: init,
    setToken: setToken
  };

  function init($http) {
    var USER = null;
    var companiesList = [];

    return {
      isAuth: function () { return !!TOKEN; },
      signup: signup,
      login: login,
      logout: logout,
      getUser: getUser,
      getCompanies: getCompanies,
      companies: function () { return companiesList; }
    };

    function getUser() {
      var promise;

      if (USER) {
        promise = Promise.resolve(USER);
      } else if (TOKEN) {
        promise = fetchUserByToken(TOKEN);
      } else {
        promise = createTempUser();
      }

      return promise;
    }

    function createTempUser() {
      return $http.post('/api/user')
      .then(function (resp) {
        // token
        saveToken(resp.data);
        console.log('created a temp usr, token: ', resp.data);
        return resp.data;
      }, function (resp) {
        // 302 (Found) - user already exists
        return (resp.status === 302) ? resp.data : Promise.reject(resp.data);
      })
      .then(function (newUserToken) {
        return fetchUserByToken(newUserToken);
      })
      .then(function (newUser) {
        USER = newUser;
        return newUser;
      })
      .catch(function (reason) {
        console.log('failed creating a new user: ', reason);
        return reason;
      });
    }

    function fetchUserByToken(userToken) {
      return $http.get('/api/user/' + userToken)
      .then(function (resp) {
        USER = resp.data;
        return resp.data;
      });
    }

    function getCompanies() {
      console.log('user.getcom: ', TOKEN);
      var promise = Promise.resolve([]);

      if (TOKEN) {
        promise = $http.get('/api/user/companies')
        .then(function (resp) {
          companiesList = resp.data;
          return resp.data;
        });
      }

      return promise;
    }

    function signup(user) {
      return getUser().then(function (curUser) {
        user.id = curUser.id;
        return $http.post('/api/signup', user)
        .then(function (resp) {
          saveToken(resp.data);
          return resp.data;
        });
      });
    }

    function logout() {
      localStorage.removeItem('token');
    }

    function login(user) {
      return $http.post('/api/login', user)
      .then(function (resp) {
        saveToken(resp.data);
        return resp.data;
      });
    }

    function saveToken(tokenToSave) {
      localStorage.setItem('token', tokenToSave);
    }
  }

  function setToken(tokenToSet) {
    TOKEN = tokenToSet;
  }
};
