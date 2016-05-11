var rp = require('request-promise');
var parser = require('xml2json');
var jobTable = require('../database').jobsTable;
module.exports = function (req, res) {
  var currentCompany = req.query;
  var finalData = JSON.parse(currentCompany.currentCompany);
  jobTable.getJobs(finalData)
  .then(function (data) {
    res.send(data);
  })
  .catch(function (err) {
    console.log('err in index.js', err);
    res.sendStatus(500);
  });

  // rp('https://stackoverflow.com/jobs/feed?searchTerm=' + companyName)
  //  .then(function(data) {
  //    var json = parser.toJson(data);
  //   //  console.log(data);
  //    res.send(json);
  //  })
  //  .catch(function(err) {
  //   console.log('error in index.js job', err);
  //   res.sendStatus(500);
  // });
};
