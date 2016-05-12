module.exports = function ($stateProvider) {
  $stateProvider.state('jobs', {
    parent: 'company',
    url: '/jobs',
    resolve: {
      jobs: function (Job, currentCompany) {
        return Job.getJobs(currentCompany);
      }
    },
    controller: 'JobsController',
    template: require('./job.html')
  });
};
