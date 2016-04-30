var jobTable = require('../database').jobsTable;
var db = require('../database');

db.companiesTable.addCompany({name: 'Apple'});
db.companiesTable.addCompany({name: 'Twitch'});
// to test set NODE_ENV=test node test.js
jobTable.addJob(
  {
    title: 'shadow hunter',
    url: 'soandso',
    description: 'JOBS!',
    visa_sponsored: true,
    remote_ok: false,
    relocation: false,
    salary: 100000,
    created: 'May fifth',
    city: 'mountain view',
    company_id: 278
  }
).then(function(data) {
  console.log(data);
});

jobTable.updateJobs(1, {title: 'software engineer', visa_sponsored: false, relocation: true})
  .then(function(data) {
    console.log(data);
  });

jobTable.getJobs({title: 'shadow hunter', description: 'JOBS!'})
.then(function (data) {
  console.log('YUSH JOBS IS THIS THINGS RIGHT MYEAH', data);
});
