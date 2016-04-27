var config = require('../common.js').config();

var Promise = require('bluebird');
var db = require('../../server/db.js')(config);
var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);

/* eslint-disable no-unused-vars */
var expect = chai.expect;
var should = chai.should();
/* eslint-enable */

var _ = require('underscore');

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

  beforeEach(function () {
    var promises = [];
    promises.push(db.clearAll());
    promises.concat(companies.map(function (company) {
      return db.addCompany(company);
    }));
    return Promise.join(promises);
  });

  describe('Get Companies', function () {
    it('Should return an array of companies', function () {
      return db.getCompanies().should.eventually.be.a('array');
    });

    it('Should take size option', function () {
      return db.getCompanies({ size: 1 })
      .should.eventually.to.have.lengthOf(1);
    });

    it('Should take filter option', function () {
      return db.getCompanies({
        filter: {
          name: 'apple',
          displayName: 'Apple'
        }
      })
      .should.eventually.satisfy(function (companies) {
        var values = companies.map(function (company) {
          return company.name;
        });

        return _.every(values, () => 'apple');
      });
    });

    it('Filter should take null', function () {
      return db.getCompanies({
        filter: {
          description: null
        }
      })
      .should.eventually.have.lengthOf(3).and.satisfy(function (companies) {
        var values = _.pluck(companies, 'name');

        return values.length === _.intersection(values, ['apple', 'google', 'stripe']).length;
      });
    });
  });

  describe('Add Company', function () {
    it('Should return companyID', function () {
      return db.addCompany(company)
      .should.eventually.be.a('number');
    });

    it('Should NOT add if company already exists', function (done) {
      db.addCompany(companies[0]).then(function () {
        // never run
      }, function () {
        done();
      });
    });
  });

  describe('Update Company', function () {
    it('Should update by name', function () {
      return db.updateCompany({ name: 'stripe' }, {
        description: 'Golden',
        url: 'https://gold.com'
      })
      .should.eventually.equal(1);
    });

    it('Should update by id', function () {
      return db.updateCompany({ id: 1 }, {
        description: 'Golden',
        url: 'https://gold.com'
      })
      .should.eventually.equal(1);
    });

    it('Should update by domain', function () {
      return db.updateCompany({ domain: 'stripe.com' }, {
        description: 'Golden',
        url: 'https://gold.com'
      })
      .should.eventually.equal(1);
    });

    it('Should NOT update if id not found', function () {
      return db.updateCompany({ id: 13 }, {
        description: 'Golden',
        url: 'https://gold.com'
      })
      .should.eventually.equal(0);
    });

    it('Should NOT throw error if no arg', function () {
      return db.updateCompany({ id: 1 })
      .should.be.rejected;
    });

    it('Should NOT throw error if no company', function () {
      return db.updateCompany().should.be.rejected;
    });
  });
});
