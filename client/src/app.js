var angular = require('angular');

var app = angular.module('jobascript', [
  'angular-jwt',
  'ui.router',
  'jobascript.company',
  'jobascript.jobs',
  'jobascript.comm',
  'jobascript.news'
]);

app.provider('User', require('./shared/UserProvider.js'));

app.config(function (UserProvider, $httpProvider, jwtInterceptorProvider) {
  var token = localStorage.getItem('token');
  console.log('from localStorage: ', token);

  if (token) {
    UserProvider.setToken(token);
  }

  jwtInterceptorProvider.tokenGetter = ['User', function (User) {
    return User.getToken();
  }];

  $httpProvider.interceptors.push('jwtInterceptor');
});

app.config(require('./routes.js').config);
app.run(require('./routes.js').listen);

app.directive('authWidget', require('./shared/topnav/authDirective.js'));
app.controller('topnavCtrl', require('./shared/topnav/topnavCtrl.js'));
app.controller('sidebarCtrl', require('./shared/sidebar/sidebarCtrl.js'));

require('angular-jwt');
require('angular-ui-router');
require('./company');
require('./jobs');
require('./communications');
require('./news');

// style
require('bootstrap/dist/css/bootstrap.css');
require('tachyons/css/tachyons.min.css');
require('./shared/layout.css');

angular.bootstrap(document, ['jobascript']);
