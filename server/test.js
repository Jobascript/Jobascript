var db = require('./db.js');

var company = {
  name: 'stripe',
  displayName: 'Stripe',
  domain: 'stripe.com',
  logo: 'https://logo.clearbit.com/stripe.com'
};

db.addCompany(company).then(function (id) {
  console.log(id + ' is added');
}, function (why) {
  console.log('fucked ', why);
});
