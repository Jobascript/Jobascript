var db = require('./database').companiesTable;

db.getCompany({ domain: 'google.com' })
.then(function (companyFound) {
  console.log('found: ', companyFound);
}, function (error) {
  console.log('sth: ', error);
}).catch(function (error) {
  console.log('error', error);
});
