var request = require('supertest');
var express = require('express');
var mocha = require('mocha');
var chai = require('chai');
var expect = chai.expect;
var rewire = require('rewire');
var http = require('http');
var sinon = require('sinon');
var chaiPromise = require('chai-as-promised');
chai.use(chaiPromise);
var companyHandler = require('../../server/company');
var db = require('../../server/db');
var supertest = require('supertest');
var base = 'http://localhost:8080';
var app = require('../../server/index');
var bodyParser = require('body-parser');
app.use(bodyParser);

  // xdescribe('base root tests', function() {
  //   it ('should respond with a 200 response code', function(done) {
  //     request.get('/')
  //     .set('accept', 'text/html')
  //     .expect(200)
  //     .end(function(err, res) {
  //       if (err) {
  //         return done(err);
  //       }
  //       done();
  //     });
  //   });
  // });


describe('/company Route Tests',  function() {
  describe('Testing addCompany Method..',   function() {
    describe('Sending a valid addCompany request: ',  function() {
      it('Should send 200 status code', function(done) {
        var req = {
              'name': 'Palantir',
              'displayName': 'Palantir Technologies',
              'domain': 'palantir.com',
              'logo': 'hello'
        };
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
        })
      }); 
      it('Posts to endpoint, receives a stringified company Id',  function (done) {
        var req = {
          body:
            {
              name: 'Palantir',
              displayName: 'Palantir Technologies',
              domain: 'palantir.com',
              logo: 'hello'
            }
        };

        request(app)
        .post('/api/company')
        .send(req)
        .expect(200, done);
      });
    });
    xdescribe('Requests with incomplete parameters:', function() {
      it('Should send 500 status code if request is missing ::name:: property',  function() {

      });
      it('Should send 500 status code if request is missing ::displayName:: property', function() {

      });
      it('Should send 500 status code if request is missing ::domain:: property',  function() {

      });
      it('Should send 500 status code if request is missing ::logo:: property',  function(){

      });
    });
  });
  xdescribe('Testing removeCompany Method..',  function () {
    describe('Sending a valid removeCompany request: ', function () {
      it('Should respond with a 200 status code', function () {

      });
    });
    describe('Sending a valid removeCompany request when company to be removed not present: ', function () {
      it('Should respond with a 404 status code', function () {

      });
    });
    describe('Requests with incomplete parameters: ', function () {
      it('Should send 500 status code', function () {

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

