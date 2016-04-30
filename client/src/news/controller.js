module.exports = function ($scope, $sce, News, currentCompany) {
  $scope.news = [];
  $scope.twitter = currentCompany.twitter;

  console.log('twitter handle', currentCompany.twitter);

  $scope.getNews = function () {
    News.getGoogleNews(currentCompany.name)
    .then(function (data) {
      $scope.news = data.feed.entries;
      console.log(data);
      $scope.news.forEach(function (entry) {
        entry.content = $sce.trustAsHtml(entry.content);
      });
    });
  };
};
