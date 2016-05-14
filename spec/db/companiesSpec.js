var Promise = require('bluebird');
var db = require('../../server/database').companiesTable;
var pgp = require('../../server/database').pgp;
var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);

/* eslint-disable no-unused-vars */
var expect = chai.expect;
var should = chai.should();
/* eslint-enable */

var _ = require('underscore');

describe('Database companies', function () {
  var ID = '';
  var comName = ''; // eslint-disable-line

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
    db.clearAll()
    .then(function () {
      Promise.map(companies, function (com) {
        return db.addCompany(com);
      });
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

  describe('Get a Company', function () {
    it('should accept name', function () {
      return db.getCompany({
        name: 'google'
      }).should.eventually.have.property('name', 'google');
    });

    it('should accept domain', function () {
      return db.getCompany({
        domain: 'google.com'
      }).should.eventually.have.property('name', 'google');
    });
  });

  describe('Get Companies', function () {
    before(function (done) {
      pgp.one('INSERT INTO companies (name, domain) VALUES (${name}, ${domain}) RETURNING id;', {
        name: 'jobascript',
        domain: 'jobascript.xyz'
      }).then(function (result) {
        return pgp.query('INSERT INTO jobs (title, url, company_id) VALUES (${title}, ${url}, ${company_id});', {
          title: 'CEO',
          url: 'jobascript.xyz',
          company_id: result.id
        });
      }).then(function () {
        done();
      });
    });

    it('Should return an array of companies', function () {
      return db.getCompanies().should.eventually.be.a('array');
    });

    it('Should take size option', function () {
      return db.getCompanies({ size: 1 })
      .should.eventually.to.have.lengthOf(1);
    });

    it('Should take false as size and return all', function () {
      return db.getCompanies({ size: false })
      .should.eventually.to.have.lengthOf(4);
    });

    it('Should take filter option', function () {
      return db.getCompanies({
        filter: {
          name: 'apple',
          display_name: 'Apple'
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
      .should.eventually.have.lengthOf(4).and.satisfy(function (companies) {
        var values = _.pluck(companies, 'name');

        return values.length === _.intersection(values, ['apple', 'google', 'stripe', 'jobascript']).length;
      });
    });

    it('take hasjobs flag and return only companies with jobs', function () {
      return db.getCompanies({
        hasjobs: true
      })
      .should.eventually.have.lengthOf(1);
    });
  });

  describe('Add Company', function () {
    it('Should return companyID', function () {
      return db.addCompany({
        name: 'uber',
        display_name: 'Uber',
        domain: 'uber.com',
        logo: 'https://logo.clearbit.com/uber.com'
      })
      .should.eventually.satisfy(function (num) {
        return !isNaN(Number(num));
      });
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
    beforeEach(function (done) {
      db.clearAll().then(function () {
        db.addCompany({
          name: 'stripe',
          domain: 'stripe.com'
        }).then(function (id) {
          ID = id;
          done();
        });
      });
    });

    it('Should update by name', function () {
      return db.updateCompany({ name: 'stripe' }, {
        description: 'Golden',
        url: 'https://gold.com'
      })
      .should.eventually.equal(1);
    });

    it('Should update by id', function () {
      return db.updateCompany({ id: ID }, {
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
