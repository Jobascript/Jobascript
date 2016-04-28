module.exports = function ($scope, Company, companies) {
  $scope.companies = Company.getList;
  // $scope.suggestions = [];

  // methods
  // $scope.suggest = _.debounce(suggestCompanies, 200);
  // $scope.addCompany = addCompany;

  // function suggestCompanies(queryStr) {
  //   if (queryStr === '') {
  //     $scope.suggestions = [];
  //     return;
  //   }

  //   Company.suggest(queryStr)
  //   .then(function (resp) {
  //     var domains = $scope.companies.map(function (company) {
  //       return company.domain;
  //     });

  //     $scope.suggestions = _.reject(resp.data, function (company) {
  //       return _.contains(domains, company.domain);
  //     });
  //   });
  // }

  // function addCompany(company) {
  //   console.log('adding: ', company);
  //   // Removing non-alphanumeric chars
  //   console.log(company.name);
  //   var name = inflection.dasherize(angular.lowercase(company.name).replace(/[^0-9a-zA-Z\s]/g, ''));
  //   angular.extend(company, {
  //     name: name,
  //     displayName: company.name
  //   });

  //   console.log('to be added: ', company);

  //   Company.addCompany(company)
  //   .then(function (id) {
  //     console.log(company.name, ' added as id: ', id);
  //     return id;
  //   })
  //   .then(refreshList)
  //   .then(clearSuggestions);
  // }

  // function clearSuggestions() {
  //   $scope.suggestions = [];
  // }

  // function refreshList() {
  //   $scope.companyName = '';
  //   $state.reload();
  // }
};
