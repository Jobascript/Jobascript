exports.config = function ($urlRouterProvider, $stateProvider) {
  $urlRouterProvider.otherwise('/a');

  $stateProvider.state('layout', {
    abstract: true,
    views: {
      '@': {
        template: require('./shared/layout.html')
      },
      'topnav@layout': {
        controller: 'topnavCtrl',
        template: require('./shared/topnav/topnav.html')
      },
      'sidebar@layout': {
        resolve: {
          companies: function ($http, User) {
            return User.getCompanies();
            
            // return Company.getCompanies({ size: 100 });
          }
        },
        controller: 'sidebarCtrl',
        template: require('./shared/sidebar/sidebar.html')
      }
    }
  });

  $stateProvider.state('home', {
    url: '/a',
    parent: 'layout',
    resolve: {
      currentUser: function (User) {
        return User.getUser();
      }
    }
  });
};

exports.listen = function ($rootScope, Company, $state) {
  // listener
  $rootScope.$on('$stateChangeSuccess', function (event, toState) {
    var companyList = Company.getList();

    // when company is removed && when loading up the first time
    if (toState.name === 'home') {
      event.preventDefault();
      if (companyList.length > 0) {
        // load the first company in the list
        $state.transitionTo('company', {
          name: companyList[0].name,
          id: companyList[0].id
        }, { reload: true });
      } else {
        // if not company goto home
        $state.transitionTo('home', {}, { notify: false });
      }
    }
  });
};
