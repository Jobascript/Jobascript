// eslint-disable-next-line no-unused-vars
module.exports = function ($http) {
   // remove comment and use $http later
  var apiKey = '291d984046483ad333ac5978886bb9ad';
  function getJobs(company) {
    return $http({
      method: 'GET',
      url: '/api/jobs',
      params: { companyName: company }
     })
    .then(function(resp) {
      console.log('this is the response', resp.data);
      return resp.data;
    })
    .catch(function(caught) {
      console.log('error in services js ', caught);
    });
  }

  return {
    getJobs: getJobs
  };
};


//api call https://authenticjobs.com/api/?api_key=291d984046483ad333ac5978886bb9ad&method=aj.jobs.search&company=adultswim&&keywords=javascript&format=JSON
