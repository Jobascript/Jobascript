var request = require('supertest');
var express = require('express');
var mocha = require('mocha');
var chai = require('chai');
var expect = chai.expect;
var rewire = require('rewire');
var http = require('http');
var sinon = require('sinon');
var companyHandler = require('../../server/company');
var db = require('../../server/db');
var supertest = require('supertest');
var base = 'http://localhost:8080';
var app = require('../../server/index');
var bodyParser = require('body-parser');
app.use(bodyParser);

var req = {
      name: 'Palantir',
      displayName: 'Palantir Technologies',
      domain: 'palantir.com',
      logo: 'hello'
};
var options = {
  size: '3',
  filter: ' a '
}

describe('/company Route Tests',  function() {
  describe('Testing addCompany Method..',   function() {
    describe('Sending a valid addCompany request: ',  function() {
      it('Should send 200 status code', function(done) {
        request(app)
        .post('/api/company')
        .send(req)
        .expect(200)
        .end(function(err,res) {
          if (err) {
            done(err);
          } else {
            done();
          }
        });
      }); 
      it('Should receive a stringified company Id',  function (done) {
        request(app)
        .post('/api/company')
        .send(req)
        .expect(function (res) {
          // why does body = {}?
          console.log('DIS BE THE RESPONSE:', res.body);
          })
        .end(function(err,res) {
          if (err) {
            done(err);
          } else {
            done();
          }
        });
      });
    });
    describe('Requests with incomplete parameters:', function(done) {
      it('Posts without ::name:: property, should send 500 status code',  function() {
        var noName = {displayName: 'Palantir Technologies', domain: 'palantir.com',logo:'hello'};
        request(app)
        .post('/api/company')
        .send(noName)
        .expect(500)
        .end(function(err,res) {
          if (err) {
            done(err);
          } else {
            done();
          }
        });
      });
      it('Should send 200 status code if request is missing ::displayName:: property', function(done) {
        var noDisplayName = {name: 'abc', domain:'xyz.com',logo:'123' };
        request(app)
        .post('/api/company')
        .send(noDisplayName)
        .expect(200)
        .end(function(err,res) {
          if (err) {
            done(err);
          } else {
            done();
          }
        })
      });
      it('Should send 200 status code if request is missing ::domain:: property',  function(done) {
        var noDomain = {name: 'efg', displayName:'hij.com', logo:'456'};
        request(app)
        .post('/api/company')
        .send(noDomain)
        .expect(200)
        .end(function(err,res) {
          if (err) {
            done(err);
          } else {
            done();
          }
        });
      });
      it('Should send 200 status code if request is missing ::logo:: property',  function(done){
        var noLogo = {name: 'klm', displayName:'nop', domain:'ghb.com'};
        request(app)
        .post('/api/company')
        .send(noLogo)
        .expect(200)
        .end(function(err,res) {
          if (err) {
            done(err);
          } else {
            done();
          }
        })
      });
    });
  });
  describe('Testing removeCompany Method..',  function () {
    xdescribe('Sending a valid removeCompany request: ', function () {
      it('Should respond with a 200 status code', function (done) {
        var companyId = '01';
        request(app)
        .delete('/api/company/' + companyId)
        .expect(200)
        .end(function(err,res) {
          if (err) {
            done(err);
          } else {
            done();
          }
        });
      });
    });
    xdescribe('Sending a valid removeCompany request when company to be removed not present: ', function () {
      it('Should respond with a 404 status code', function (done) {
        var companyId = '10001';
        request(app)
        .delete('/api/company/' + companyId)
        .expect(404)
        .end(function(err, res) {
          if (err) {
            done(err);
          } else {
            done();
          }
        });
      });
    });
    describe('Requests with incomplete parameters: ', function () {
      it('Should send 500 status code', function (done) {
        // error here
        var errorParam = 'aw';
        request(app)
        .delete('/api/company/' + errorParam)
        .expect(500)
        .end(function (err, res) {
          if (err) {
            done(err);
          } else {
            done();
          }
        });
      });
    });
  });
  describe('Testing getCompanies Method..', function () {
    describe('Sending a valid getCompanies request: ', function () {
      it('Should respond with 200 status code', function (done) {
        request(app)
        .get('/api/companies')
        .send(options)
        .expect(200)
        .end(function (err, res) {
          if (err) {
            done(err);
          } else {
            done();
          }
        });
      });
      it('Should respond with companies', function (done) {
        this.timeout(3000);
        request(app)
        .get('/api/companies')
        .send(options)
        .expect(function(res) {
          // need more detail in how to implement test here
          // res.body is an array
          return res.body;
        })
        .end(function (err, res ) {
          if (err) {
            done(err);
          } else {
            done();
          }
        });
      });
    });
    describe('Requests with incomplete parameters: ', function () {
      xit('Should send 500 status code if request is missing query parameters', function (done) {
        // db call should be returning 500 here
        request(app)
        .get('/api/companies')
        .send(options)
        .expect(500)
        .end(function(err, res) {
          if (err) {
            done(err);
          } else {
            done();
          }
        });
      });
    });
  });
  describe('Testing getCompany Method..', function () {
    describe('Sending a valid getCompany request: ', function () {
      it('Should respond with company, sending a 200 status code', function () {
        // should add first then remove
        var companyId = '2';
        request(app)
        .get('/api/company' + companyId)
        .expect(200)
        .end(function(err,res) {
          if (err) {
            done(err);
          } else {
            done();
          }
        });
      });
      it('Should respond with a 404 status code if no company matching id is present', function () {
        var companyId = '2444';
        request(app)
        .get('/api/company' + companyId)
        .expect(404)
        .end(function(err,res) {
          if(err) {
            done(err);
          } else {
            done();
          }
        });
      });
      xit('Should respond with a 404 status code if no company matching domain is present', function () {
        // not sure how to input domain into get request
      });
    });
    describe('Requests with incomplete parameters: ', function () {
      it('Should respond with a 400 status code if query type is undefined (neither id nor domain)', function () {
        request(app)
        .get('/api/company')
        .expect(400)
        .end(function(err,res) {
          if (err) {
            done(err);
          } else {
            done();
          }
        });
      });
    });
    xdescribe('Sending an invalid getCompany request: ', function () {
      it('Should respond with a 500 status code if ...', function () {
        // not sure  here what this error is actually describing
      });
    });
  });
});
