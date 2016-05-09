module.exports = function ($scope, $sce, News, currentCompany) {
  $scope.news = [];

  $scope.getNews = function (comp) {
    News.getNews(comp).then(function (data) {
      $scope.news = data;
    });
  };

  $scope.getNews(currentCompany.id);
};
