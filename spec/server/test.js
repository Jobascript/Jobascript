var request = require('supertest');
var express = require('express');
var mocha = require('mocha');
var app = express();

request = request('http://localhost:8080');

describe('should return a 200 when you hit /', function() {
  it ('respond with a 200 response code', function(done) {
    request.get('/').expect(200, function(err) {
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
