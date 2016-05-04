module.exports = function ($stateProvider) {
  $stateProvider.state('jobs', {
    parent: 'company',
    url: '/jobs',
    controller: 'JobsController',
    template: require('./job.html')
  });
};
