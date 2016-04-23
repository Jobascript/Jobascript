module.exports = function ($scope, Company, companies) {
  var refreshList;
  $scope.companies = companies;

  refreshList = function (id) {
    $scope.companyName = '';
    Company.getCompany(id)
    .then(function (newCompany) {
      console.log('new: ', newCompany);
      $scope.companies.unshift(newCompany);
    });
  };

  $scope.addCompany = function (companyName) {
    console.log('to be added: ', companyName);
    Company.addCompany({
      name: companyName
    })
    .then(function (id) {
      console.log(companyName, ' added as id: ', id);
      return id;
    })
    .then(refreshList);
  };
};
