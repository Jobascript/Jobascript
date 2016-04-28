var rp = require('request-promise');
<<<<<<< HEAD
<<<<<<< HEAD
var parser = require('xml2json');
=======
>>>>>>> back-end route working for jobs, working on getting the request to be appended with angular
=======
var parser = require('xml2json');
>>>>>>> job description appears on click, and also minimizes on click. Parse XML to JSON, Escape all HTML characters and append tham as proper tags, also use regex to escape all <br> tags to style properly

module.exports = function getJobs(req, res) {
  console.log(req.query.companyName);
  var companyName = req.query.companyName;
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> job description appears on click, and also minimizes on click. Parse XML to JSON, Escape all HTML characters and append tham as proper tags, also use regex to escape all <br> tags to style properly
  rp('https://stackoverflow.com/jobs/feed?searchTerm=' + companyName)
   .then(function(data) {
     var json = parser.toJson(data);
    //  console.log(data);
     res.send(json);
   })
   .catch(function(err) {
    console.log('error in index.js job', err);
  });
<<<<<<< HEAD
};


// parser.on('title', function(title) {
//       console.log(title);
// });
=======

  rp('https://authenticjobs.com/api/?api_key=291d984046483ad333ac5978886bb9ad&method=aj.jobs.search&company=' + companyName + '&keywords=javascript&format=JSON')
    .then(function(data) {
      res.send(data);
    })
    .catch(function(err) {
      console.log('error in index.js job', err);
    });
};
>>>>>>> back-end route working for jobs, working on getting the request to be appended with angular
=======
};


// parser.on('title', function(title) {
//       console.log(title);
// });
>>>>>>> job description appears on click, and also minimizes on click. Parse XML to JSON, Escape all HTML characters and append tham as proper tags, also use regex to escape all <br> tags to style properly
