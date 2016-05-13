var angular = require('angular');

var app = angular.module('jobascript', [
  'angular-jwt',
  'ui.router',
  'ngToast',
  'jobascript.company',
  'jobascript.jobs',
  'jobascript.comm',
  'jobascript.news'
]);

app.provider('User', require('./shared/UserProvider.js'));

app.config(function (UserProvider, $httpProvider, jwtInterceptorProvider, ngToastProvider) {
  var token = localStorage.getItem('token');
  console.log('from localStorage: ', token);

  if (token) {
    UserProvider.setToken(token);
  }

  ngToastProvider.configure({
    // dismissOnTimeout: false,
    dismissButton: true,
    verticalPosition: 'bottom',
    horizontalPosition: 'center',
    maxNumber: 3
  });

  jwtInterceptorProvider.tokenGetter = ['User', function (User) {
    return User.getToken();
  }];

  $httpProvider.interceptors.push('jwtInterceptor');
});

app.config(require('./routes.js').config);
app.run(require('./routes.js').listen);

app.directive('authWidget', require('./shared/auth_widget/authDirective.js'));
app.controller('topnavCtrl', require('./shared/topnav/topnavCtrl.js'));
app.controller('sidebarCtrl', require('./shared/sidebar/sidebarCtrl.js'));

require('angular-jwt');
require('angular-ui-router');
require('ng-toast');
require('./company');
require('./jobs');
require('./communications');
require('./news');

// style
require('ng-toast/dist/ngToast.min.css');
require('bootstrap/dist/css/bootstrap.css');
require('tachyons/css/tachyons.min.css');
require('./shared/layout.css');

angular.bootstrap(document, ['jobascript']);

// var googleScript = window.document.createElement('script');
// googleScript.onload = function () {
//   console.log('gapi');
//   angular.bootstrap(document, ['jobascript']);
// };
// googleScript.setAttribute('src', 'https://apis.google.com/js/client.js');
// googleScript.setAttribute('id', 'onetime');

// if (!window.document.getElementById('onetime')) {
//   window.document.head.appendChild(googleScript);
// }
