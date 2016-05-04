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
          console.log('DIS BE THE RESPONSE:', res.body);
          typeof res.body === 'string'
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
    describe('Sending a valid removeCompany request: ', function () {
      it('Should respond with a 200 status code', function () {
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
    describe('Sending a valid removeCompany request when company to be removed not present: ', function () {
      it('Should respond with a 404 status code', function () {
        var companyId = '02';
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
      it('Should send 500 status code', function () {
        var companyId = '03';
        request(app)
        .delete('/api/company/' + companyId)
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
  xdescribe('Testing getCompanies Method..', function () {
    describe('Sending a valid getCompanies request: ', function () {
      it('Should respond with 200 status code', function () {

      });
      it('Should respond with companies', function () {

      });
    });
    xdescribe('Requests with incomplete parameters: ', function () {
      it('Should send 500 status code if request is missing query parameters', function () {

      });
    });
  });
  xdescribe('Testing getCompany Method..', function () {
    describe('Sending a valid getCompany request: ', function () {
      it('Should respond with company, sending a 200 status code', function () {

      });
      it('Should respond with a 404 status code if no company matching id or domain is present', function () {

      });
    });
    describe('Requests with incomplete parameters: ', function () {
      it('Should respond with a 400 status code if query type is undefined (neither id nor domain)', function () {

      });
    });
    describe('Sending an invalid getCompany request: ', function () {
      it('Should respond with a 500 status code if ...', function () {

      });
    });
  });
});

