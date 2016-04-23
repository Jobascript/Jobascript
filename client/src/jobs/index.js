var job = angular.module('jobascript.jobs', ['jobascript.company']);

job.config(require('./routes.js'));

job.controller('JobsController', require('./controller.js'));
job.factory('Job', require('./services.js'));

module.exports = job;
