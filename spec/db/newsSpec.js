var Company = require('../../server/database/index.js').companiesTable;
var News = require('../../server/database/index.js').newsTable;
var pgp = require('../../server/database/index.js').pgp;
var moment = require('moment');

var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);

/* eslint-disable no-unused-vars */
var expect = chai.expect;
var should = chai.should();
/* eslint-enable */

describe('News Table Query', function () {
  var companyID = '';
  var company = {
    name: 'twitch.com',
    display_name: 'TWITCH',
    domain: 'www.twitch.com'
  };

  before(function (done) {
    
    return News.clearAll()
    .then(Company.clearAll)
    .then(function () {
      done();
    });
  });

  after(function (done) {
    return News.clearAll()
    .then(Company.clearAll)
    .then(function () {
      done();
    });
  });

  describe('Inserting', function () {

    var article = {
      title: 'Some guy acquires Twitch for $1',
      snippet: 'Some guy pays one dollar to acquire twitch',
      url: 'www.news.com',
      date_written: '2016-5-10'
    };

    beforeEach(function (done) {
      pgp.query('DELETE FROM news;')
      .then(function () {
        return Company.addCompany(company);
      })
      .then(function (compID) {
        companyID = compID;
      })
      .then(function () {
        return News.addNews(article, companyID);
      })
      .then(function () {
        done();
      });
    });

    afterEach(function (done) {
      pgp.tx(function (t) {
        t.batch([
          t.query('DELETE FROM news;'),
          t.query('DELETE FROM companies;')
        ]);
      })
      .then(function () {
        done();
      });
    });

    it('should successfully add an article', function () {
      var thisArticle = {
        title: 'Some guy acquires Twitch for $1',
        snippet: 'Some guy pays one dollar to acquire twitch',
        url: 'www.ddddddddd.com',
        date_written: '2014-5-10'
      };

      return News.addNews(thisArticle, companyID)
      .should.eventually.be.fullfilled;
    });

    it('should reject articles with collided urls', function () {
      var thisArticle = {
        title: 'Some guy acquires Twitch for $1',
        snippet: 'Some guy pays one dollar to acquire twitch',
        url: 'www.news.com',
        date_written: '2016-5-10'
      };

      return News.addNews(thisArticle, companyID)
      .should.be.rejected;
    });
  });

  describe('Removing old articles', function () {
    var article = {
      title: 'Some guy acquires Twitch for $1',
      snippet: 'Some guy pays one dollar to acquire twitch',
      url: 'www.news.com',
      date_written: '2015-5-10'
    };

    beforeEach(function (done) {
      pgp.query('DELETE FROM news;')
      .then(function () {
        return Company.addCompany(company);
      })
      .then(function (compID) {
        companyID = compID;
      })
      .then(function () {
        return News.addNews(article, companyID);
      })
      .then(function () {
        done();
      });
    });

    afterEach(function (done) {
      pgp.tx(function (t) {
        t.batch([
          t.query('DELETE FROM news;'),
          t.query('DELETE FROM companies;')
        ]);
      })
      .then(function () {
        done();
      });
    });

    it('should successfully remove articles older than 30 days', function () {

      return News.removeOld()
      .then(function () {
        return News.getNews({ company_id: companyID });
      })
      .should.eventually.be.empty;
    });

    it('should not remove articles newer than 30 days', function () {
      var article = {
        title: 'Some guy acquires Twitch for $1',
        snippet: 'Some guy pays one dollar to acquire twitch',
        url: 'www.newnews.com',
        date_written: moment(new Date()).format()
      };
        
      return News.addNews(article, companyID)
      .then(News.removeOld)
      .then(function () {
        return News.getNews({ company_id: companyID });
      })
      .should.eventually.not.be.empty;
    });
  });

  describe('getNews', function () {
    var article = {
      title: 'Some guy acquires Twitch for $1',
      snippet: 'Some guy pays one dollar to acquire twitch',
      url: 'www.news.com',
      date_written: '2015-5-10'
    };

    beforeEach(function (done) {
      pgp.query('DELETE FROM news;')
      .then(function () {
        return Company.addCompany(company);
      })
      .then(function (compID) {
        companyID = compID;
      })
      .then(function () {
        return News.addNews(article, companyID);
      })
      .then(function () {
        done();
      });
    });

    it('should return news articles related to a particular company', function () {
      News.getNews({ company_id: companyID })
      .should.eventually.be.an('array').lengthOf(1);
    });

    xit('should return no articles if none exist', function (done) {
      News.getNews({ company_id: companyID }).then(function (articles) {
        expect(articles).to.be.empty;
        done();
      });
    });
  });
});
