module.exports = function ($http) {

  var alchemyUrl = 'https://gateway-a.watsonplatform.net/calls/data/GetNews?apikey=f0855469b5be36c6b4ae467290751bf8663f014a'

  var getNews = function () {
    return $http({
      method: 'GET',
      url: alchemyUrl 
    })
  }
  return {};
};
