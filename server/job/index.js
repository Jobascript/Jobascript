var rp = require('request-promise');

module.exports = function getJobs(req, res) {
  console.log(req.query.companyName);
  var companyName = req.query.companyName;

  rp('https://authenticjobs.com/api/?api_key=291d984046483ad333ac5978886bb9ad&method=aj.jobs.search&company=' + companyName + '&keywords=javascript&format=JSON')
    .then(function(data) {
      res.send(data);
    })
    .catch(function(err) {
      console.log('error in index.js job', err);
    });
};
