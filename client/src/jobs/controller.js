module.exports = function ($scope, Job, currentCompany) {
  $scope.currentJobs = [];
  $scope.jobDescription = '';
  console.log(currentCompany);
  $scope.jobs = function(){
    Job.getJobs(currentCompany.name).then(function (data) {
      console.log('this is the data', data);
      $scope.currentJobs = data.listings.listing;
      // $scope.jobDescription = $scope.currentJobs.description;
      // console.log($scope.jobDescription);
      console.log($scope.currentJobs, 'this is jobs');
    });
  };

  $scope.jobs(currentCompany.name);

};
