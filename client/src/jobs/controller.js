module.exports = function ($scope, Job, currentCompany) {
  $scope.currentJobs = [];
  $scope.jobSkills = [];
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


// <div> Required Skills
//   <li ng-repeat='jobSkills in job.category'>{{jobSkills}}</li>
// </div>


// <div>
//   <input type='text' placeholder='filter locations' ng-model='jobSearch'/>
//   <div ng-repeat="job in currentJobs | filter: {title: jobSearch}">
//     <li>{{decode(job.title)}}</li>
//     <h4>Apply here <a ng-href='{{job.link}}' target='_blank'>{{job.link}}</a></h4>
//     <div class='job.publish'>Posted On {{decode(job.pubDate)}}</div>
//     <div class='description-{{$index}}' ng-click="clicked(job)">Job Description</div>
//     <li class='job-compact' ng-class="{'job-compact': job.isCompact}" ng-bind-html='decode(job.description)'></d>
//   </div>
// </div>
