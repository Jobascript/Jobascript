/* eslint-disable no-unused-vars */
var Promise = require('bluebird');
var usersTable = require('../../server/database').usersTable;
var companiesTable = require('../../server/database').companiesTable;
var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);

var expect = chai.expect;
var should = chai.should();
/* eslint-enable */

describe('Database Users', function () {
  describe('Create Users', function () {
    after(function (done) {
      usersTable.clearAll().then(function () {
        done();
      });
    });

    it('Should add anonymous user and return user obj', function () {
      return usersTable.createUser()
      .then(function (user) {
        return user;
      })
      .should.eventually.have.property('username');
    });

    it('Should add user with username', function () {
      return usersTable.createUser({ username: 'dummy' })
      .should.eventually.have.property('username', 'dummy');
    });
  });

  describe('Follow Company', function () {
    var userID = '';
    var companyID = '';

    before(function (done) {
      usersTable.createUser()
      .then(function (user) {
        userID = user.id;
        return companiesTable.addCompany({ name: 'uber' });
      })
      .then(function (id) {
        companyID = id;
        done();
      });
    });

    after(function (done) {
      usersTable.clearAll().then(function () {
        return companiesTable.clearAll();
      })
      .then(function () {
        done();
      });
    });

    it('Takes userID and companyID and link them', function () {
      return usersTable.followCompany(userID, companyID).should.be.fulfilled;
    });
  });
});
