var Entities = require('html-entities').AllHtmlEntities;
var entities = new Entities();
var moment = require('moment');

module.exports = function ($scope, Job, currentCompany, jobs) {
  $scope.currentCompany = currentCompany;

  $scope.jobs = jobs.map(function (job) {
    job.description = entities.decode(job.description);
    job.created = moment(job.created).fromNow();
    job.expand = false;
    return job;
  });
};
