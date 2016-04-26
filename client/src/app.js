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
    var companyList = Company.getList();

    // when company is removed && when loading up the first time
    if (toState.name === 'home') {
      event.preventDefault();
      if (companyList.length > 0) {
        // load the first company in the list
        $state.transitionTo('company', {
          name: companyList[0].name,
          id: companyList[0].id
        }, { reload: true });
      } else {
        // if not company goto home
        $state.transitionTo('home', {}, { notify: false });
      }
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
