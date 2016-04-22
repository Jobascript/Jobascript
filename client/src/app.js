var angular = require('angular');

var app = angular.module('jobascript', [
  'ui.router',
  'jobascript.company'
]);

app.config(function ($urlRouterProvider, $stateProvider) {
  $urlRouterProvider.otherwise('/dashboard');

  $stateProvider.state('index', {
    abstract: true,
    // url: '/',
    views: {
      '@': {
        template: require('./shared/layout.html')
      },
      'sidebar@index': {
        resolve: {
          companies: function (Company) {
            return Company.getCompanies({ size: 10 });
          }
        },
        controller: 'sidebarCtrl',
        template: require('./shared/sidebar/sidebar.html')
      }
    }
  });

  $stateProvider.state('home', {
    url: '/dashboard',
    parent: 'index'
  });

  console.log('app');
});

app.controller('sidebarCtrl', require('./shared/sidebar/sidebarCtrl.js'));

require('angular-ui-router');
require('./company');

angular.bootstrap(document, ['jobascript']);
