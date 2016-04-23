module.exports = function ($scope, Job, currentCompany) {
  console.log(currentCompany);
  $scope.jobs = Job.getJobs();
};
