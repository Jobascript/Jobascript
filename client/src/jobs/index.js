var job = angular.module('jobascript.jobs', ['jobascript.company', 'ngSanitize', 'ngAnimate']);



job.config(require('./routes.js'));

job.controller('JobsController', require('./controller.js'));
job.factory('Job', require('./services.js'));
job.filter('renderHTMLCorrectly', require('./filter.js'));

require('./styles.css');
require('angular-sanitize');
require('angular-animate');
module.exports = job;
