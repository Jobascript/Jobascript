var rp = require('request-promise');
var parser = require('xml2json');

module.exports = function getJobs (req, res) {
  // console.log(req.query.companyName);
  var companyName = req.query.companyName;
  rp('https://stackoverflow.com/jobs/feed?searchTerm=' + companyName)
   .then(function(data) {
     var json = parser.toJson(data);
    //  console.log(data);
     res.send(json);
   })
   .catch(function(err) {
    console.log('error in index.js job', err);
    res.sendStatus(500);
  });
};
