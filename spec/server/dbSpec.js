var config = require('../common.js').config();

var db = require('../../server/db.js')(config);
var expect = require('chai').expect;

describe('Database tests', function () {
  var company = {
    name: 'uber',
    displayName: 'Uber',
    domain: 'uber.com',
    logo: 'https://logo.clearbit.com/uber.com'
  };

  var companies = [
    {
      name: 'stripe',
      displayName: 'Stripe',
      domain: 'stripe.com',
      logo: 'https://logo.clearbit.com/stripe.com'
    },
    {
      name: 'apple',
      displayName: 'Apple',
      domain: 'apple.com',
      logo: 'https://logo.clearbit.com/apple.com'
    },
    {
      name: 'google',
      displayName: 'Google',
      domain: 'google.com',
      logo: 'https://logo.clearbit.com/google.com'
    }
  ];

  before(function () {
    var promises = companies.map(function (company) {
      return db.addCompany(company);
    });
    return Promise.all(promises);
  });
  
  describe('Add Company', function () {
    it('Should return companyID', function () {
      db.addCompany(company, function (id) {
        expect(id).to.be.a('number');
      });
    });

    it('Should NOT add if company already exists', function (done) {
      db.addCompany(companies[0]).then(function (id) {
        // never run
      }, function (reason) {
        done();
      });
    });
  });

  describe('Update Company', function () {
    it('Should update by name', function () {
      db.updateCompany({name: 'stripe'}, {
        displayName: 'Striper',
        url: 'https://pornhub.com'
      })
      .then(function (changes) {
        expect(changes).to.equal(1);
      });
    });

    it('Should update by id', function () {
      db.updateCompany({id: 1}, {
        displayName: 'Striper',
        url: 'https://pornhub.com'
      })
      .then(function (changes) {
        expect(changes).to.equal(1);
      });
    });

    it('Should NOT update if id not found', function () {
      db.updateCompany({id: 13}, {
        displayName: 'Striper',
        url: 'https://pornhub.com'
      })
      .then(function (changes) {
        expect(changes).to.equal(0);
      });
    });
  });
});
