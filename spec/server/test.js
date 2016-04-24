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

describe('base root tests', function() {
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


describe('/company route tests', function() {
  it ('should respond with a 200 status code to show that the company was added', function(done) {
    var data =  {
      id: 1,
      name: "google",
      created: "2016-04-23T00:22:40.510Z"
    };
    companyHandler.__set__("db", {getCompany: function(args) {
      expect(args.name).to.equal('google');
      var returnPromised = new Promise(function(resolve, reject) {
        setTimeout(function() {
          resolve(data);
        }, 0);
      });
    }
  });
    request.get('/company')
    .set('accept', 'application/json')
    .query({name: 'google'})
    .end(function(err, res) {
      if (err) {
        throw err;
      }
      expect(res.body).to.deep.equal(data);
      done();
    });
  });

  // it ('should respond with a 200 after a company has been successfully deleted', function(done) {
  //   request.delete('company')
  //   .delete('/company')
  //   .set('accept', 'application/json')
  //   .send({id: 2})
  //   // .expect(200)
  //   .expect(function(res) {
  //     console.log(res);
  //   })
  //   .end(function(err, res) {
  //     if (err) {
  //       throw err;
  //     }
  //     done();
  //   });
  // });
});
