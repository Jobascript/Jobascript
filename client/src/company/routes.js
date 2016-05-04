var _ = require('underscore');

exports.config = function ($stateProvider) {
  $stateProvider.state('company', {
    parent: 'home',
    url: '/company/:id/:name',
    resolve: {
      currentCompany: function ($stateParams, Company, currentUser, companies) {
        var companyId = $stateParams.id;
        return Company.getCompany(companyId)
        .then(function (company) {
          if ($stateParams.name !== company.name) {
            $stateParams.name = company.name;
          }

          company.isFollowing = false;

          _.each(companies, function (userCom) {
            if (userCom.id === company.id) {
              company.isFollowing = true;
            }
          });
          
          return company;
        });
      }
    },
    views: {
      'main@layout': {
        controller: 'CompanyController',
        template: require('./company.html')
      }
    }
  });
};

exports.listen = function ($rootScope, $state) { // eslint-disable-line no-unused-vars
  $rootScope.$on('$stateChangeSuccess', function (event, toState) {
    if (toState.name === 'company') {
      // disbale auto load jobs tab temporarily
      // $state.go('jobs', {}, { relative: toState });
    }
  });
};
