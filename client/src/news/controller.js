module.exports = function ($scope, $sce, News, currentCompany) {
  $scope.news = [];

  $scope.getNews = function (query) {
    News.getGoogleNews(query)
    .then(function (data) {
      console.log('data', data);
      $scope.news = data.feed.entries;
      if ($scope.news.length === 0) {
        $scope.news = [{ content: 'Sorry, there is no news for that topic' }];
      }
      $scope.news.forEach(function (entry) {
        entry.contentHTML = $sce.trustAsHtml(entry.content);
      });
    });
  };

  $scope.filter = function () {
    $scope.newsFilter = $scope.newsFilter.split(' ').join('+');
    var searchQuery = currentCompany.name + '+' + $scope.newsFilter;
    $scope.getNews(searchQuery);

    $scope.newsFilter = '';
  };

  $scope.getNews(currentCompany.name);
};
