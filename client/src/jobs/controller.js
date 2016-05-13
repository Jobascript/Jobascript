
var Entities = require('html-entities').AllHtmlEntities;
var entities = new Entities();
var moment = require('moment');

module.exports = function ($scope, Job, currentCompany) {
  $scope.currentJobs = [];
  $scope.jobSkills = [];
  $scope.jobDescription = '';
  $scope.details = null;
  $scope.currentCompany = currentCompany;

  $scope.jobs = jobs.map(function (job) {
    job.description = entities.decode(job.description);
    job.created = moment(job.created).fromNow();
    job.expand = false;

    return job;
  });

console.log(currentCompany);
 Job.getJobs(currentCompany).then(function (data) {
   $scope.currentJobs = data.rows;
   console.log(data.rows);
    if (!Array.isArray($scope.currentJobs)) {
      $scope.currentJobs = [$scope.currentJobs];
      $scope.currentJobs[0].isCompact = true;
    }
    // console.log(data);
    $scope.currentJobs.forEach(function (job) {
      job.isCompact = true;
    });
    // console.log($scope.currentJobs, 'currentjobs');
    // console.log('raw data', data);
  });

  $scope.clicked = function (job) {
    job.isCompact = !job.isCompact;
  };
  $scope.decode = function htmlDecode (input) {
    var e = document.createElement('div');
    e.innerHTML = input;
    return e.childNodes.length === 0 ? '' : e.childNodes[0].nodeValue.replace(/\<br \/\>/g, '');
  };

};
