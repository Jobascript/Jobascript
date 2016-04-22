var angular = require('angular');

var app = angular.module('jobascript', [
  'ui.router',
  'jobascript.company'
]);

app.config(function ($urlRouterProvider, $stateProvider) {
  $urlRouterProvider.otherwise('/');

  $stateProvider.state('home', {
    url: '/',
    views: {
      sidebar: {
        controller: 'sidebarCtrl',
        template: require('./shared/sidebar/sidebar.html')
      }
    }
  });

  console.log('app');
});

app.controller('sidebarCtrl', require('./shared/sidebar/sidebarCtrl.js'));

require('angular-ui-router');
require('./company');

angular.bootstrap(document, ['jobascript']);
