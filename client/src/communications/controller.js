module.exports = function ($scope, Comm, currentC8ompany) {
  console.log(currentCompany);
  $scope.emails = Comm.getEmails();
};
