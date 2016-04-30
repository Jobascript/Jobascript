module.exports = function ($http) {
   // remove comment and use $http later
  function getJobs(company, relocate, visa, remote) {
    return $http({
      method: 'GET',
      url: '/api/jobs',
      params: { companyName: company, relocate: relocate, visa: visa, remote: remote }
    })
    .then(function (resp) {
      console.log('this is the response', resp.data);
      return resp.data;
    })
    .catch(function (caught) {
      console.log('error in services js ', caught);
    });
  }
  function getJobListing(listing) {
    console.log("gets here");
    return $http({
      method: 'GET',
      url: '/api/job',
      params: { jobListing: listing }
    })
    .then(function (resp) {
      console.log('this is the jobListing resp', resp.data);
      return resp.data;
    })
    .catch(function (caught) {
      console.log('error in services js', caught);
    });
  }

  return {
    getJobs: getJobs,
    getJobListing: getJobListing
  };
};
