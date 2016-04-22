module.exports = function ($scope, Company, companies) {
  $scope.companies = companies;
  
  $scope.addCompany = function (companyName) {
    Company.addCompany({
      name: companyName
    }).then(function (id) {
      console.log(companyName, ' added as id: ', id);
    });
  };
};
