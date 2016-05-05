var angular = require('angular');

var app = angular.module('jobascript', [
  'ui.router',
  'jobascript.company',
  'jobascript.jobs',
  'jobascript.comm',
  'jobascript.news'
]);

app.provider('User', require('./shared/UserProvider.js'));

app.config(function (UserProvider) {
  // localStorage
  var username = localStorage.getItem('user');
  console.log('from localStorage: ', username);

  if (username) {
    UserProvider.setUsername(username);
  }
});

app.config(require('./routes.js').config);
app.run(require('./routes.js').listen);

app.controller('topnavCtrl', require('./shared/topnav/topnavCtrl.js'));
app.controller('sidebarCtrl', require('./shared/sidebar/sidebarCtrl.js'));

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
