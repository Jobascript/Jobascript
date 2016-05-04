var jobTable = require('./database').jobsTable;

jobTable.addJob(
  {
    title: 'Developer',
    url: 'soandso',
    description: 'JOBS!',
    visa_sponsored: true,
    remote_ok: false,
    relocation: false,
    salary: 100000,
    created: 'May fifth',
    city: 'mountain view',
  }
).then(function(data) {
  console.log(data);
});
