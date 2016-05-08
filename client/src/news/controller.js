module.exports = function ($scope, $sce, News, currentCompany) {
  $scope.news = [];

  $scope.getNews = function (comp) {
    News.getNews(comp.id).then(function (data) {
      console.log(data);
    })
  }
};
