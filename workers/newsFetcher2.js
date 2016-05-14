var Promise = require('bluebird');
var _ = require('underscore');
var db = require('../server/database');
var rp = require('request-promise');
var moment = require('moment');
var url = require('url');
var rssParser = Promise.promisify(require('rss-parser').parseString);


var GOOGLENEW_URL = 'https://news.google.com/news/section';
var ALCHEMY_URL = 'https://gateway-a.watsonplatform.net/calls/data/GetNews';

var companiesWithoutNews = [
  'SELECT companies.name, companies.id',
  'FROM companies LEFT JOIN news',
  'ON (companies.id <> news.company_id)',
  'GROUP BY companies.id;'
].join(' ');


db.pgp.query(companiesWithoutNews)
.then(function (companies) {
  console.log('fetching news for ' + companies.length + ' companies');
  return Promise.map(companies, function (company) {
    return fetchGoogleNews(company);
  });
})
.then(function (arrayOfArrays) {
  return _.flatten(arrayOfArrays);
})
.then(function (newsArray) {
  return Promise.map(newsArray, addNews);
})
.then(function (array) {
  console.log('>>>>>> Completed!! <<<<<<');
  console.log(_.reject(array, (a) => !a).length + ' news added to DB');
})
.catch(function (error) {
  console.log('FAILED: ', error);
});

function addNews(obj) {
  return db.newsTable.addNews(obj)
  .then(function (id) {
    console.log('NEWS!: ', obj.title + ' at ' + obj.company_name + ' added with id: ' + id);
    return id;
  })
  .catch(function (reason) { // catch exisiting jobs
    if (reason.constraint === 'jobs_url_key') {
      console.log('NEWS!: ', obj.title, ' already exisits');
    }
    return false;
  });
}

// function fetchAlchemy() {
//   return rp({
//     uri: ALCHEMY_URL,
//     qs: {
      
//     }
//   });
// }

function fetchGoogleNews(company) {
  return rp({
    uri: GOOGLENEW_URL,
    json: false,
    qs: {
      output: 'rss',
      q: company.name
    }
  })
  .then(rssParser)
  .then(function (data) {
    console.log('found ', data.feed.entries.length, ' news for ', company.name);
    return mapColumns(data.feed.entries, company);
  });
}

function mapColumns(newsArray, company) {
  return newsArray
  .map(function (article) {
    var realUrl = url.parse(article.link, true).query.url;

    var source = article.title.split(' - ');
    source = source[source.length - 1];
    if(article.contentSnippet.slice(0, source.length) === source){
      article.contentSnippet = article.contentSnippet.substr(source.length, 1000);
    }

    return {
      title: article.title,
      snippet: article.contentSnippet.substr(0, 300) + '...',
      url: realUrl,
      // image_url: ,
      date_written: moment(new Date(article.pubDate)).toISOString(),
      // author:,
      company_id: company.id
    };
  });
}
