var Promise = require('bluebird');
var db = require('../../server/database').usersTable;
var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);

/* eslint-disable no-unused-vars */
var expect = chai.expect;
var should = chai.should();
/* eslint-enable */

describe('Database Users', function () {
  describe('Create Users', function () {
    it('Should add anonymous user and return user obj', function () {
      db.createUser()
      .should.eventually.have.property('username')
      .and.have.property('id')
      .and.have.property('temp', true);
    });

    it('Should add user with username', function () {
      db.createUser({ username: 'dummy' })
      .should.eventually.have.property('id')
      .and.have.property('temp', true)
      .and.have.property('username', 'dummy');
    });
  });
});
