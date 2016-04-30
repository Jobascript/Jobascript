var rp = require('request-promise');
var parser = require('xml2json');


exports.getJobs = function(req, res) {
  console.log(req.query.companyName);
  var companyName = req.query.companyName;
  var offersRelocation = req.query.relocate;
  var offersVisa = req.query.visa;
  var allowsRemote = req.query.remote;
  console.log(allowsRemote);
  rp('https://stackoverflow.com/jobs/feed?searchTerm=' + companyName + '&offersrelocation=' + offersRelocation + '&offersvisasponsorship=' + offersVisa + '&allowsremote=' + allowsRemote)
   .then(function(data) {
     var json = parser.toJson(data);
     res.send(json);
   })
   .catch(function(err) {
    console.log('error in index.js job', err);
    res.sendStatus(500);
  });
}

exports.getJobListing = function(req, res) {
  console.log('req listing from index.js', req.query.jobListing);
  res.send('hurro george');
};


// http://stackoverflow.com/jobs?
// searchTerm=twitch&location=san+francisco&range=20&distanceUnits=Miles&
// allowsremote=true&
// offersrelocation=true&
// offersvisasponsorship=true
