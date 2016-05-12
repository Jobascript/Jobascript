var assert = require('chai').assert;
var expect = require('chai').expect;
var config = require('../common.js').config();
var Company = require('../../server/database/index.js').companiesTable
var News = require('../../server/database/index.js').newsTable;

describe('News Table Query', function () {
  var companyID = '';
  before(function (done) {
    var company = {
      name: 'twitch.com',
      display_name: 'TWITCH',
      domain: 'www.twitch.com'
    };

    Company.addCompany(company).then(function (compID) {
      companyID = compID;
      done();
    });
  });
  describe ('Inserting', function () {
    it ('should successfully add an article', function (done) {
      var article = {
        title: 'Some guy acquires Twitch for $1',
        snippet: 'Some guy pays one dollar to acquire twitch',
        url: 'www.news.com',
        date_written: '2016-5-10'
      };

      News.addNews(article, companyID).then(function (articleID) {
        expect(articleID).to.be.ok;
        News.clearAll().then(function (data) {
          done();
        });
      });
    });
    it ('should only accept articles with unique urls', function (done) {
      var article = {
        title: 'Some guy acquires Twitch for $1',
        snippet: 'Some guy pays one dollar to acquire twitch',
        url: 'www.news.com',
        date_written: '2016-5-10'
      };

      News.addNews(article, companyID).then(function (articleID) {
        News.addNews(article, compID).then(function (articleID) {
        }).catch(function (err) {
          expect(err).to.be.ok;
          News.clearAll().then(function (data) {
            done();
          });
        });
      });
    });
  });

  describe ('Removing old articles', function () {
    it ('should successfully remove articles older than 30 days', function (done) {
      var article = {
        title: 'Some guy acquires Twitch for $1',
        snippet: 'Some guy pays one dollar to acquire twitch',
        url: 'www.news.com',
        date_written: '2015-5-10'
      };

      News.addNews(article, companyID).then(function (articleID) {
        News.removeOld().then(function (data) {
          News.getNews({ company_id: compID }).then(function (articles) {
            expect(articles).to.be.empty;
              
            done();
          })
        });
      });
    });
    it ('should not remove articles newer than 30 days', function (done) {
      var today = new Date();

      var article = {
        title: 'Some guy acquires Twitch for $1',
        snippet: 'Some guy pays one dollar to acquire twitch',
        url: 'www.news.com',
        date_written: today
      };
        
        News.addNews(article, companyID).then(function (articleID) {
          News.removeOld().then(function (data) {
            News.getNews({ company_id: compID }).then(function (articles) {
              expect(articles).to.not.be.empty;
              News.clearAll().then(function (data) {
                Company.clearAll().then(function (data) {
                  done();
                });
              });
            });
          });
        });
      });
    });
  });

  xdescribe('getNews', function () {

  });
});