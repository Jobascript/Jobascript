module.exports = function ($scope, $sce, News, currentCompany) {
  $scope.news = [];
  $scope.compName = currentCompany.display_name;

  $scope.getNews = function (comp) {
    News.getNews(comp).then(function (data) {
      $scope.news = data;
    });
  };

  $scope.getNews(currentCompany.id);
};
