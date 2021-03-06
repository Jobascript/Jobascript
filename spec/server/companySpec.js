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

  xdescribe('company tests', function () {
    after(function (done) {
      db.companiesTable.clearAll()
      .then(function () {
        done();
      });
    });

    it('should respond with a company ID after the company was added', function (done) {
      request.post('/api/company')
      .send({
        name: 'google',
        display_name: 'Google',
        domain: 'google.com',
        logo: 'https://logo.clearbit.com/google.com'
      })
      .expect(function (res) {
        console.log('>>>> ', res.body);
        return expect(JSON.parse(res.body)).to.be.a('number');
        // if (!isNaN(Number(res.body))) {
        //   throw new Error('Response is not a number');
        // }
      })
      .expect(200, done);
    });
  });
});

