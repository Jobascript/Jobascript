module.exports = function ($http) {
  function getJobs(currentCompany) {
    return $http({
      method: 'GET',
      url: '/api/jobs',
      params: { company_id: currentCompany.id }
    })
    .then(function (resp) {
      return resp.data;
    })
    .catch(function (caught) {
      console.error('error in jobs js ', caught);
    });
  }
  return {
    getJobs: getJobs
  };
};
