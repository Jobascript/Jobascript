module.exports = function ($urlRouterProvider, $stateProvider) {
  $urlRouterProvider.otherwise('/a');

  $stateProvider.state('layout', {
    abstract: true,
    views: {
      '@': {
        template: require('./shared/layout.html')
      },
      'sidebar@layout': {
        resolve: {
          companies: function (Company) {
            return Company.getCompanies({ size: 20 });
          }
        },
        controller: 'sidebarCtrl',
        template: require('./shared/sidebar/sidebar.html')
      }
    }
  });

  $stateProvider.state('home', {
    url: '/a',
    parent: 'layout'
  });
};
