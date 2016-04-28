module.exports = function ($scope, Job, currentCompany) {
  $scope.currentJobs = [];
  $scope.jobDescription = '';
  $scope.minimizeDetails = {
    something: false,
    lastThing: true
  };
  $scope.clicked = function(input, index) {
    $scope.targetElement = input.path[0].className;
    var currentState = $scope.minimizeDetails[index];
    Object.keys($scope.minimizeDetails).forEach(function(element) {
      $scope.minimizeDetails[element] = false;
    });
    if (!currentState) {
      $scope.minimizeDetails[index] = true;
    }
  };
  $scope.decode = function htmlDecode(input){
    var e = document.createElement('div');
    e.innerHTML = input;
    return e.childNodes.length === 0 ? "" : e.childNodes[0].nodeValue.replace(/\<br \/\>/g, '');
  };
  $scope.jobs = function(){
    Job.getJobs(currentCompany.name).then(function (data) {
      $scope.currentJobs = data.rss.channel.item;
      console.log($scope.currentJobs, 'currentjobs');
    });
  };
  $scope.jobs(currentCompany.name);
};
