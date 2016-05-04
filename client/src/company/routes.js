exports.config = function ($stateProvider) {
  $stateProvider.state('company', {
    parent: 'home',
    url: '/company/:id/:name',
    resolve: {
      currentCompany: function ($stateParams, Company, currentUser) {
        var companyId = $stateParams.id;
        return Company.getCompany(companyId)
        .then(function (company) {
          if ($stateParams.name !== company.name) {
            $stateParams.name = company.name;
          }
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

exports.listen = function ($rootScope, $state) {
  $rootScope.$on('$stateChangeSuccess', function (event, toState) {
    if (toState.name === 'company') {
      // $state.go('jobs', {}, { relative: toState });
    }
  });
};
