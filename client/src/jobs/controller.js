
var Entities = require('html-entities').AllHtmlEntities;
var entities = new Entities();
var moment = require('moment');

module.exports = function ($scope, Job, currentCompany, jobs) {
  $scope.currentJobs = [];
  $scope.jobSkills = [];
  $scope.jobDescription = '';
  $scope.details = null;
  $scope.currentCompany = currentCompany;
  $scope.isCompact = true;

  $scope.jobs = jobs.map(function (job) {
    job.description = entities.decode(job.description);
    job.created = moment(job.created).fromNow();
    job.expand = false;
    return job;
  });

  $scope.jobs.forEach(function (job) {
    job.isCompact = true;
  });

 $scope.clicked = function (job) {
    job.isCompact = !job.isCompact;
    console.log(job.isCompact);
  };
  $scope.decode = function htmlDecode (input) {
    var e = document.createElement('div');
    e.innerHTML = input;
    return e.childNodes.length === 0 ? '' : e.childNodes[0].nodeValue.replace(/\<br \/\>/g, '');
  };
};
