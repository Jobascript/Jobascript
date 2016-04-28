var db = require('../../server/db.js');
var server = require('../../server/index.js');
var supertest = require('supertest');
var expect = require('chai').expect;

var request = supertest.agent(server);

describe('base root tests', function() {
  it('should respond with a 200 response code', function() {
    request.get('/')
    .expect(200);
  });
});

describe('/api/company route tests', function() {
  beforeEach(function() {
    return db.clearAll();
  });
  it('should respond with a company ID after the company was added', function(done) {
    var data = {
      name: 'google'
    };
    request.post('/api/company')
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

  xit('should return the same company that was added', function(done) {
    var company = {name: 'google'};
    beforeEach(function() {
      return db.addCompany(company);
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
    request.get('/api/company')
    .set('accept', 'application/json')
    .query({name: 'google'})
    .end(function(err, res) {
      if (err) {
        throw err;
      }
      // console.log('res.body', res);
      done(expect(res.body.name).to.equal('google'));
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
