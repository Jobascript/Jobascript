var request = require('supertest');
var express = require('express');
var mocha = require('mocha');
var chai = require('chai');
var expect = chai.expect;
var rewire = require('rewire');
// var app = express();
var companyHandler = rewire('../../server/company');
var db = require('../../server/db');

request = request('http://localhost:8080');

xdescribe('base root tests', function() {
  it ('should respond with a 200 response code', function(done) {
    request.get('/')
    .set('accept', 'text/html')
    .expect(200)
    .end(function(err, res) {
      if (err) {
        return done(err);
      }
      done();
    });
  });
});


xdescribe('/company Route Tests',  function() {
  describe('Testing addCompany Method..',   function() {
    describe('Sending a valid addCompany request: ',  function() {
      it('Should send 200 status code', function() {

      });
      it('Should respond with a stringified company Id',  function () {

      });
    });
    describe('Requests with incomplete parameters:', function() {
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
  describe('Testing removeCompany Method..',  function () {
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
  describe('Testing getCompanies Method..', function () {
    describe('Sending a valid getCompanies request: ', function () {
      it('Should respond with 200 status code', function () {

      });
      it('Should respond with companies', function () {

      });
    });
    describe('Requests with incomplete parameters: ', function () {
      it('Should send 500 status code if request is missing query parameters', function () {

      });
    });
  });
  describe('Testing getCompany Method..', function () {
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
