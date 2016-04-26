module.exports = function ($stateProvider) {
  $stateProvider.state('jobs', {
    parent: 'company',
    url: '/jobs',
    resolve: {
      currenCompany: function($stateParams, Company) {
        var companyName = $stateParams.name;
        console.log(companyName);
      }
    },
    controller: 'JobsController',
    template: require('./job.html')
  });
};
