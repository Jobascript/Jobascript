
var angular = require('angular');
require('angular-ui-router');
require('angular-ui-router.statehelper')
require('./company/');

angular.module('jobascript', [
	'ui.router',
	// 'ui.router.statehelper',
	'jobascript.company'
]);


