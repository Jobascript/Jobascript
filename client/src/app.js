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
  // UserProvider.setUserName('jake');
});

app.run(function (User) {
  User.fetch().then(function (user) {
    console.log('user created: ', user);
  });
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
