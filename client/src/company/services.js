var clearbitUrl = 'https://autocomplete.clearbit.com/v1/companies/suggest';

module.exports = function ($http) {
  var list = [];

  var suggestCompanies = function (queryStr) {
    if (!queryStr) {
      return Promise.reject();
    }

    return $http.get(clearbitUrl, {
      params: { query: queryStr }
    });
  };

  // companyObj comes in form of {name: 'name'}
  var addCompany = function (companyObj) {
    return $http.post('/api/company', companyObj)
    .then(function (resp) {
      return resp.data;
    }, function (err) {
      console.error('err', err);
    });
  };

  // companyID
  var deleteCompany = function (companyID) {
    return $http({
      method: 'DELETE',
      url: '/api/company/' + companyID
    })
    .then(function (resp) {
      return resp.data;
    }, function (err) {
      console.error('err', err);
    });
  };

  /**
   * @param  {Object} options = {size: Number}
   * @return {Promise} resolved to Array of company Objects
   */
  var getCompanies = function (options) {
    return $http.get('/api/companies', {
      params: options
    })
    .then(function (resp) {
      list = resp.data;
      return resp.data;
    }, function (err) {
      console.error('err', err);
    });
  };

  /**
   * @param  {Number} company id
   * @return {Promise} resolved to ompany Object
   */
  var getCompany = function (id) {
    return $http.get('/api/company', {
      params: { id: id }
    })
    .then(function (resp) {
      return resp.data;
    }, function (err) {
      console.error('err', err);
    });
  };

  return {
    getCompany: getCompany,
    getCompanies: getCompanies,
    addCompany: addCompany,
    deleteCompany: deleteCompany,
    suggest: suggestCompanies,
    getList: function () {
      return list;
    }
  };
};
