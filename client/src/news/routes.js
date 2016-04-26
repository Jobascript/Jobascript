module.exports = function ($stateProvider) {
  $stateProvider.state('news', {
    parent: 'company',
    url: '/news',
    controller: 'NewsController',
    template: require('./news.html')
  });
};
