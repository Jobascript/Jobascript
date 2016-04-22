module.exports = function ($http) {
  // companyObj comes in form of {name: 'name'}
  var addCompany = function (companyObj) {
    return $http({
      method: 'POST',
      url: '/api/company',
      data: companyObj
    })
    .then(function (resp) {
      return resp.data;
    });
  };

  // companyObj comes in form of {id: 'id'}
  var deleteCompany = function (companyObj) {
    return $http({
      method: 'DELETE',
      url: '/api/company',
      data: companyObj
    })
    .then(function(resp){
      return resp.data;
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
    addCompany: addCompany,
    deleteCompany: deleteCompany,
    getCompany: getCompany
  };
};
