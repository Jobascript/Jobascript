module.exports = function ($scope, Job, currentCompany) {
  $scope.currentJobs = [];
  $scope.jobDescription = '';

  $scope.clicked = function (job) {
    job.isCompact = !job.isCompact;
  };
  $scope.decode = function htmlDecode(input) {
    var e = document.createElement('div');
    e.innerHTML = input;
    return e.childNodes.length === 0 ? '' : e.childNodes[0].nodeValue.replace(/\<br \/\>/g, '');
  };
  Job.getJobs(currentCompany.name).then(function (data) {
    $scope.currentJobs = data.rss.channel.item;
    if (!Array.isArray($scope.currentJobs)) {
      $scope.currentJobs = [$scope.currentJobs];
      $scope.currentJobs[0].isCompact = true;
    }
    console.log(data);
    $scope.currentJobs.forEach(function (job) {
      job.isCompact = true;
    });
    console.log($scope.currentJobs, 'currentjobs');
    console.log('raw data', data);
  });
};
