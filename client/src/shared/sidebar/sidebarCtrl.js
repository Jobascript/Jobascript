module.exports = function ($scope, Company) {
  $scope.addCompany = function (companyName) {
    Company.addCompany({
      name: companyName
    }).then(function (id) {
      console.log(companyName, ' added as id: ', id);
    });
  };
};
