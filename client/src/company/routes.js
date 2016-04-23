module.exports = function ($stateProvider) {
  $stateProvider.state('company', {
    parent: 'home',
    url: '/company/:name/:id',
    resolve: {
      currentCompany: function ($stateParams, Company) {
        var companyId = $stateParams.id;
        console.log('id: ', companyId);
        return Company.getCompany(companyId);
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
