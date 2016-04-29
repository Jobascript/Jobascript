module.exports = function ($http) {
  var getGoogleNews = function (companyName) {
    return $http({
      method: 'GET',
      url: '/api/news',
      params: { name: companyName }
    })
    .then(function (resp) {
      return resp.data;
    }, function (err) {
      console.log('err', err);
    });
  };

  return {
    getGoogleNews: getGoogleNews
  };
};
