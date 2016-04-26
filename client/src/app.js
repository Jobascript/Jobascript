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
  $rootScope.$on('$stateChangeSuccess', function (event, toState) {
    var promise = null;

    // when company is removed && when loading up the first time
    if (toState.name === 'home') {
      event.preventDefault();
      promise = Company.getCompanies().then(function (companies) {
        if (companies.length > 0) {
          // load the first company in the list
          $state.transitionTo('company', {
            name: companies[0].name,
            id: companies[0].id
          }, { reload: true });
        } else {
          // if not company goto home
          $state.transitionTo('home', {}, { notify: false });
        }
      });
    }
    return promise;
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
