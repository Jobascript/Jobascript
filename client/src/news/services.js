module.exports = function ($http) {
  var alchemyKey 
  // = 'ccb8fd2204772690e0260ef3fcdb99772422b22d';
  // = 'aeacf083250dd17e5e5cc0da04aa316da4e94bfd';
  = 'f0855469b5be36c6b4ae467290751bf8663f014a';

  var alchemyUrl = 'https://gateway-a.watsonplatform.net/calls/data/GetNews?apikey=' + alchemyKey + '&outputMode=json&start=now-1y&end=now';

  var getAlchemyNews = function (companyName) {
    return $http({
      method: 'GET',
      url: alchemyUrl + '&return=enriched.url.text,enriched.url.url,enriched.url.title,enriched.url.image&dedup=1&rank=high^medium&q.enriched.url.enrichedTitle.entities.entity.text=' + companyName
    })
    .then(function (resp) {
      return resp.data;
    }, function (err) {
      console.log('err', err);
    });
  };

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
    getAlchemyNews: getAlchemyNews,
    getGoogleNews: getGoogleNews
  };
};
