module.exports = function ($scope, Job, currentCompany) {
  $scope.jobs = [];
  console.log(currentCompany);
  $scope.jobs = function(){
    Job.getJobs(currentCompany.name).then(function (data) {
      console.log('this is the data', data);
      return data;
    });
  };
  $scope.jobs(currentCompany.name);
};
