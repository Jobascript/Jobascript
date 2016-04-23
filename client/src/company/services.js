module.exports = function ($http) {
  // companyObj comes in form of {name: 'name'}
  var addCompany = function (companyObj) {
    return $http.post('/api/company', companyObj)
    .then(function (resp) {
      return resp.data;
    }, function (err) {
      console.error('err', err);
    });
  };

  // companyObj comes in form of {id: 'id'}
  var deleteCompany = function (companyObj) {
    return $http({
      method: 'DELETE',
      url: '/api/company',
      data: companyObj
    })
    .then(function (resp) {
      return resp.data;
    }, function (err) {
      console.error('err', err);
    });
  };

  var getCompanies = function (options) {
    return $http.get('/api/companies', {
      data: options
    })
    .then(function (resp) {
      return resp.data;
    }, function (err) {
      console.error('err', err);
    });
  };

  var getCompany = function (companyObj) {
    return $http({
      method: 'GET',
      url: '/company',
      params: companyObj
    })
    .then(function(data){
      console.log(data)
      return data;
    });
  };

  return {
    getCompanies: getCompanies,
    addCompany: addCompany,
    deleteCompany: deleteCompany,
    getCompany: getCompany
  };
};
