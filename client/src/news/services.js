module.exports = function ($http) {
  var alchemyKey 
  = 'bdf61f38670ada050dfb48037b7300a420d81f13'
  // = 'aeacf083250dd17e5e5cc0da04aa316da4e94bfd'
  // = 'ccb8fd2204772690e0260ef3fcdb99772422b22d'

  var alchemyUrl = 'https://gateway-a.watsonplatform.net/calls/data/GetNews?apikey=' + alchemyKey + '&outputMode=json&start=now-1M&end=now&'

  var getAlchemyNews = function (companyName) {
    return $http({
      method: 'GET',
      url: alchemyUrl + 'q.enriched.url.enrichedTitle.entities.entity.text=' + companyName 
      + '&q.enriched.url.enrichedTitle.relations.relation.action.verb.text=O[acquire^release]&return=enriched.url.url,enriched.url.title'
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
      params: {name: companyName}
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
