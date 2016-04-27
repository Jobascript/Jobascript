var config = require('../common.js').config();

var db = require('../../server/db.js')(config);
var chai = require("chai");
var chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);

var expect = chai.expect;
var should = chai.should();

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
      return db.addCompany(company)
      .should.eventually.be.a('number');
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
      return db.updateCompany({name: 'stripe'}, {
        description: 'Striper',
        url: 'https://pornhub.com'
      })
      .should.eventually.equal(1);
    });

    it('Should update by id', function () {
      return db.updateCompany({id: 1}, {
        description: 'Striper',
        url: 'https://pornhub.com'
      })
      .should.eventually.equal(1);
    });

    it('Should update by domain', function () {
      return db.updateCompany({domain: 'stripe.com'}, {
        description: 'Striper',
        url: 'https://pornhub.com'
      })
      .should.eventually.equal(1);
    });

    it('Should NOT update if id not found', function () {
      return db.updateCompany({id: 13}, {
        description: 'Striper',
        url: 'https://pornhub.com'
      })
      .should.eventually.equal(0);
    });
  });
});
