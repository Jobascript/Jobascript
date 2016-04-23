module.exports = function ($urlRouterProvider, $stateProvider) {
  $stateProvider.state('company', {
    parent: 'home',
    url: '/company/:name/:id',
    views: {
      'main@layout': {
        controller: 'CompanyController',
        template: require('./company.html')
      }
    }
  });
};
