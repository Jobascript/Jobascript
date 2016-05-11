var job = angular.module('jobascript.jobs', ['jobascript.company', 'ngSanitize']);

job.config(require('./routes.js'));
job.controller('JobsController', require('./controller.js'));
job.factory('Job', require('./services.js'));

require('./styles.css');
require('angular-sanitize');
module.exports = job;
