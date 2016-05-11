var db = require('../../server/database').companiesTable;
var newsTable = require('../../server/database').newsTable;
var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);

/* eslint-disable no-unused-vars */
var expect = chai.expect;
var should = chai.should();
/* eslint-enable */

xdescribe('Database news', function () {
  var companies = [
    {
      name: 'stripe',
      display_name: 'Stripe',
      domain: 'stripe.com',
      logo: 'https://logo.clearbit.com/stripe.com'
    },
    {
      name: 'apple',
      display_name: 'Apple',
      domain: 'apple.com',
      logo: 'https://logo.clearbit.com/apple.com'
    },
    {
      name: 'google',
      display_name: 'Google',
      domain: 'google.com',
      logo: 'https://logo.clearbit.com/google.com'
    }
  ];

  before(function (done) {
    Promise.map(companies, function (com) {
      return db.addCompany(com);
    })
    .then(function () {
      done();
    })
    .catch(function (reason) {
      console.log('in test, ', reason);
      done(reason);
    });
  });

  after(function (done) {
    return db.clearAll().then(function () {
      done();
    });
  });

  describe('addNews', function () {
    it('Should add news', function () {
      // newsTable.addNews({

      // });
    });
  });
});
