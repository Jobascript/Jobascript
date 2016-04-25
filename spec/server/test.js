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
  it ('should respond with a company ID after the company was added', function(done) {
    var data = {
      name: 'google'
    };
  //   companyHandler.__set__("db", {addCompany: function(args) {
  //     // expect(args.id).to.equal(1);
  //     var returnPromise = new Promise(function(resolve, reject) {
  //       setTimeout(function() {
  //         resolve(data);
  //       }, 0);
  //     });
  //    }
  //  });
   request.post('/company')
     .set('accept', 'application/json')
     .send({"name": "google"})
     .expect(function(res) {
      //  console.log('res.text', res);
       res.text = Number(res.text);
       if (typeof res.text !== 'number') {
         throw new Error('Response is not a number');
       }
     })
     .expect(200)
     .end(function(err, res) {
       if (err) {
         throw err;
       }
      done();
     });
  });
  it ('should return the same company that was added', function(done) {
    var company = {name: 'google'};
    beforeEach(function() {
      db.addCompany(company);
    });
  //   companyHandler.__set__("db", {getCompany: function(args) {
  //     expect(args.name).to.equal('google');
  //     var returnPromised = new Promise(function(resolve, reject) {
  //       setTimeout(function() {
  //         resolve(data);
  //       }, 0);
  //     });
  //   }
  // });
    request.get('/company')
    .set('accept', 'application/json')
    .query({name: 'google'})
    .end(function(err, res) {
      if (err) {
        throw err;
      }
      // console.log('res.body', res);
      expect(res.body.name).to.equal('google');
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
