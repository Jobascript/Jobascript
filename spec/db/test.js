var assert = require('chai').assert;
var expect = require('chai').expect;
var config = require('../common.js').config();
var db = require('../../server/db.js')(config)

describe('DB Query', function () {
  describe ('Inserting', function () {
    it ('should successfully add a company', function (done) {
      
      var company = {
        name: 'yahoo.com'
      };

      db.addCompany(company);

      expect(db.getCompany(company).then(function (data) {
        return data;
      })).to.exist;

      done();
    });
    xit ('should take a company object as an argument', function () {
      var company = 'google.com';

      db.addCompany(company).then(function(data){
        console.log(data);
      }, function(reason){
        // expect(reason).to.equal('company has to have a name property! e.g. {name: \'google\'...}')
        console.log('this is the reason', reason)
        expect(reason).to.throw(err)
      })

      expect(db.addCompany(company)).to.throw(err);

    });
  });

  describe ('Removing', function () {
    it ('should successfully delete a company', function (done) {
      var company = {
        name: 'cnn.com'
      };

      db.addCompany(company).then(function(compId){
        console.log('COMPANY ID', compId);

        db.removeCompany(compId).then(function(compObj){
      
          expect(compObj).to.exist;
          done();
        }, function (err) {
          console.log('LOOK AT ME!', err);
        });
      })
    })
  })
});
