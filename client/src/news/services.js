module.exports = function ($http) {

  var getNews = function (company) {
    return $http({
      method: 'GET',
      url: '/api/news',
      params: { company_id: company }
    })
    .then(function (resp) {
      return resp.data;
    }, function (err) {
      console.log('err', err);
    });
  };

  return {
    getNews: getNews
  };
};
