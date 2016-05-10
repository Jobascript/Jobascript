exports.config = function ($urlRouterProvider, $stateProvider) {
  $urlRouterProvider.otherwise('/getting-started');

  $stateProvider.state('layout', {
    abstract: true,
    resolve: {
      currentUser: function (User) {
        return User.getUser().catch(function (err) {
          console.error(err);
        });
      },
      companies: function (User) {
        return User.getCompanies().catch(function (err) {
          console.error(err);
        });
      }
    },
    views: {
      '@': {
        template: require('./shared/layout.html')
      },
      'topnav@layout': {
        controller: 'topnavCtrl',
        template: require('./shared/topnav/topnav.html')
      },
      'sidebar@layout': {
        controller: 'sidebarCtrl',
        template: require('./shared/sidebar/sidebar.html')
      }
    }
  });

  $stateProvider.state('home', {
    url: '/a',
    parent: 'layout'
  });

  $stateProvider.state('start', {
    url: '/getting-started',
    resolve: {
      topCompanies: function (Company) {
        return Company.getCompanies({ size: 5 });
      }
    },
    controller: require('./pages/getting-started/controller.js'),
    template: require('./pages/getting-started/index.html')
  });
};

exports.listen = function ($rootScope, User, $state) {
  // listener
  $rootScope.$on('$stateChangeSuccess', function (event, toState) {
    var companyList = User.companies();

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
        // if no company goto start
        $state.transitionTo('start', {}, { reload: true });
      }
    }
  });
};
