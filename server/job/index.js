var rp = require('request-promise');
var parser = require('xml2json');
var cheerio = require('cheerio');
var html2json = require('html2json').html2json;


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

exports.getJobListing = function(req, res) {
  var jobPage = req.query.jobListing;
  // console.log('req listing from index.js', req.query.jobListing);
  rp(jobPage)
   .then(function(data) {
     var $ = cheerio.load(data);
     var pageData = [];
     pageData.push({duties: $('div.description').text()});
     console.log($('.jobdetail').text());
    // console.log("Pre Results:", data);
    // var results = html2json(data);
    // console.log("Results:", typeof results);
    res.send(pageData);
  })
  .catch(function(err) {
    console.log('error in index.js, getJobListing', err);
    res.sendStatus(500);
  });
};

exports.getMultipleJobs = function(req, res) {
  var companyName = req.query.companyName;
  var promise1 = rp('https://jobs.github.com/positions?description=' + companyName + '&location=' )
  .then(function(data) {
    var $ = cheerio.load(data);
    var pageData = [];
    // console.log($('.positionlist')[0].children, 'position list')
    var jobTitle = $('.positionlist')[0].children.map(function(val) {
      return $('.title').html();
    });
    pageData.push(
      {
        jobTitle: jobTitle
      }
    );
    // res.json(pageData);
  }).catch(function(err) {
    console.log('err in promise1 index.js', err);
    res.sendStatus(500);
  });
  var promise2 = rp('http://api.indeed.com/ads/apisearch?publisher=9810665890415219&format=json&v=2&q=' + companyName )
    .then(function(data) {
      // res.json(data);
    })
    .catch(function(err) {
      console.log('err in promise2 index.js', err);
      res.sendStatus(500);
    });
  var promise3 = rp('https://authenticjobs.com/api/?api_key=291d984046483ad333ac5978886bb9ad&format=JSON&method=aj.jobs.search&company=' + companyName)
    .then(function(data) {
      res.json(data);
    })
    .catch(function(err) {
      console.log('err in promise3, index.js', err);
      res.sendStatus(500);
    });

};


// JSON.stringify({
//   data: $('title').html()
// })

// http://stackoverflow.com/jobs?
// searchTerm=twitch&location=san+francisco&range=20&distanceUnits=Miles&
// allowsremote=true&
// offersrelocation=true&
// offersvisasponsorship=true

//monster search
//http://www.monster.com/jobs/search/
//?kwdv=48 <== computer science job
//?kwdv=46 <== software development
