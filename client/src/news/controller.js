module.exports = function ($scope, News, currentCompany) {
  $scope.news = [];

  $scope.getNews = (function () {
    News.getGoogleNews(currentCompany.name)
    .then(function (data) {
      $scope.news = data.feed.entries;

      console.log($scope.news);
    });
  }());
};
