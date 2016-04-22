var request = require('supertest');
var express = require('express');
var mocha = require('mocha');
var app = express();

request = request('http://localhost:8080');

describe('base root tests', function() {
  it ('should respond with a 200 response code', function(done) {
    request.get('/').expect(200, function(err) {
      console.log(err);
    });
  });
});


describe('/company route tests', function() {
  it ('should respond with a 200 status code to show that the company was added', function() {
    request.post('/company').expect(404, function(err) {
      console.log(err);
    })
    .end(function(err, res) {
      if (err) {
        return done(err);
      }
      done();
    });
  });
});
