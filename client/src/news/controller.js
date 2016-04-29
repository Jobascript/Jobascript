module.exports = function ($scope, News, currentCompany) {
  $scope.news;

  console.log(currentCompany.name)

  $scope.getNews = (function () {
    News.getGoogleNews(currentCompany.name)
    .then(function(data) {
      $scope.news = data.feed.entries;

      console.log($scope.news);
    });
  })();
};
