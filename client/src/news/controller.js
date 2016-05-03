module.exports = function ($scope, $sce, News, currentCompany) {
  $scope.news = [];

  // $scope.getAlchemyNews = function () {
  //   News.getAlchemyNews(currentCompany.name + ',type=company|')
  //   .then(function (data) {
  //     console.log('alchemy data!', data);
  //   })
  // };

  $scope.getNews = function (query) {
    // News.getGoogleNews(query)
    // .then(function (data) {
    //   $scope.news = data.feed.entries;

      News.getAlchemyNews(query)
      .then(function (data) {
        console.log(data);
        // data.result.docs.forEach(function (entry) {
          // var newsObj = { contentSnippet: entry.source.enriched.url.text, link: entry.source.enriched.url.url, title: entry.source.enriched.url.title };
          // $scope.news.push(newsObj);
        // });
        $scope.news = data.result.docs;
        console.log($scope.news);

        console.log('alchemyNews!', data);
        // if ($scope.news.length === 0) {
        //   $scope.news = [{ source: { enriched: { url: { text: 'Sorry, there is no news for that topic' }}}}];
        // }
      })
      
    // });
  };

  $scope.filter = function () {
    // $scope.newsFilter = $scope.newsFilter.split(' ').join('+');
    // var searchQuery = currentCompany.name + '+' + $scope.newsFilter;
    // $scope.getNews(searchQuery);
    if($scope.newsFilter === ''){
      $scope.getNews(currentCompany.name.split('-').join('+'));
    }
    else {
      var query = currentCompany.name.split('-').join('+') + '&q.enriched.url.keywords.keyword.text=' + $scope.newsFilter;
      $scope.getNews(query);
      console.log('successfully calling getNews! with:', query);
    }

    $scope.newsFilter = '';

    // console.log('newsFilter!', input);
  };

  // $scope.getAlchemyNews();
  $scope.getNews(currentCompany.name.split('-').join('+'));
  console.log(currentCompany.name.split('-').join('+'));
};
