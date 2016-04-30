module.exports = function ($stateProvider) {
  $stateProvider.state('jobs', {
    parent: 'company',
    url: '/jobs',
    resolve: {
      additionalOptions: function($stateParams) {
        console.log($stateParams);
      }
    },
    controller: 'JobsController',
    template: require('./job.html')
  });
};
