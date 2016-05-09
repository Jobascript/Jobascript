module.exports = function () {
  var TOKEN = null;

  return {
    $get: init,
    setToken: setToken
  };

  function init($http, jwtHelper) {
    var companies = [];
    return {
      isAuth: function () { return !!TOKEN && !jwtHelper.decodeToken(TOKEN).temp; },
      signup: signup,
      login: login,
      logout: logout,
      getUser: getUser,
      getToken: function () { return TOKEN; },
      getCompanies: getCompanies,
      companies: function () { return companies }
    };

    function getUser() {
      var promise;

      if (TOKEN) {
        promise = Promise.resolve(jwtHelper.decodeToken(TOKEN));
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
        return jwtHelper.decodeToken(newUserToken);
      })
      .then(function (newUser) {
        return newUser;
      })
      .catch(function (reason) {
        console.log('failed creating a new user: ', reason);
        return reason;
      });
    }

    function getCompanies() {
      console.log('user.getcom: ', TOKEN, jwtHelper.decodeToken(TOKEN));
      var promise = Promise.resolve([]);

      if (TOKEN) {
        promise = $http.get('/api/user/companies')
        .then(function (resp) {
          companies = resp.data; // update cached companies
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
      TOKEN = null;
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
