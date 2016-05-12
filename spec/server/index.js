var db = require('../../server/database');
var server = require('../../server/index.js');
var supertest = require('supertest');
var expect = require('chai').expect;

var request = supertest.agent(server);

describe('API Routes Tests', function () {
  describe('base root tests', function () {
    it('should respond with a 200 response code', function () {
      request.get('/')
      .expect(200);
    });
  });

  describe('job tests', function () {
    var COM_ID;
    before(function (done) {
      db.companiesTable.addCompany({
        name: 'google',
        display_name: 'Google',
        domain: 'google.com',
        logo: 'https://logo.clearbit.com/google.com'
      })
      .then(function (id) {
        COM_ID = id;
        done();
      });
    });

    after(function (done) {
      db.companiesTable.clearAll()
      .then(db.jobsTable.clearAllJobs)
      .then(function () {
        done();
      });
    });

    it('GET', function (done) {
      request.get('/api/jobs')
      .query({ company_id: COM_ID })
      .expect(200, done);
    });
  });

  describe('company tests', function () {
    after(function (done) {
      db.companiesTable.clearAll()
      .then(function () {
        done();
      });
    });

    it('should respond with a company ID after the company was added', function (done) {
      request.post('/api/company')
      .type('json')
      .send({
        name: 'google',
        display_name: 'Google',
        domain: 'google.com',
        logo: 'https://logo.clearbit.com/google.com'
      })
      .expect(function (res) {
        console.log('>>>> ', res.body);
        return expect(Number(res.body.id)).not.to.be.NaN;
      })
      .expect(200, done);
    });
  });
});
