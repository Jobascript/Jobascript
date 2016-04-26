var angular = require('angular');

var app = angular.module('jobascript', [
  'ui.router',
  'jobascript.company',
  'jobascript.jobs',
  'jobascript.comm'
]);

app.config(require('./routes.js'));
app.run(function ($rootScope, Company, $state) {
  // listener
  $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams, options) {

    console.log('$stateChangeStart ', fromState, fromParams, toState, toParams);
    if (fromState.name !== '' && toState.name === 'home') {
      event.preventDefault();
      return Company.getCompanies().then(function (companies) {
        $state.go('company', {
          name: companies[0].name,
          id: companies[0].id
        }, { reload: true });
      });
    }
  });
});

app.controller('sidebarCtrl', require('./shared/sidebar/sidebarCtrl.js'));

require('angular-ui-router');
require('./company');
require('./jobs');
require('./communications');

// style
require('bootstrap/dist/css/bootstrap.css');
require('tachyons/css/tachyons.min.css');
require('./shared/layout.css');

angular.bootstrap(document, ['jobascript']);
