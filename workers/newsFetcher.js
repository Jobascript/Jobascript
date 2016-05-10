var url = require('url');
var config = require('../server/common.js').config();
var Promise = require('bluebird');
var parseURL = Promise.promisify(require('rss-parser').parseURL);
var moment = require('moment');
var axios = require('axios');
var _ = require('underscore');

var Companies = require('../server/database').companiesTable;
var News = require('../server/database').newsTable;

var alchemyKey 
= 'ccb8fd2204772690e0260ef3fcdb99772422b22d';
// = 'aeacf083250dd17e5e5cc0da04aa316da4e94bfd';
// = 'f0855469b5be36c6b4ae467290751bf8663f014a';

Companies.getCompanies()
.then(function (companies) {
  var companyInfo = companies.map(function (company) {
    return [company.name, company.id];
  });
  return companyInfo;
})
.then(function (companyNames) {
  return new Promise(function (resolve, reject) {
    Promise.map(companyNames, function (companyName) {
      return parseURL('https://news.google.com/news/section?output=rss&q=' + companyName[0]);
    })
    .then(function (results) {
      for(var i = 0; i < results.length; i++) {
        results[i].id = companyNames[i][1];
      }
      resolve(results);
    });
  });
})
.then(function (data) {
  data.forEach(function (val) {
    var compID = val.id;
    val.feed.entries.forEach(function (article) {
      var link = url.parse(article.link, true);
      link = link.query.url;
      var source = article.title.split(' - ');
      source = source[source.length - 1];
      var articleObj = {
        title: article.title,
        snippet: article.contentSnippet.substr(source.length, 300 + source.length) + '...',
        url: link,
        date_written: moment(article.pubDate).format()
      };
      News.addNews(articleObj, val.id);
    });
  });
})
.then(function (data) {
  News.removeOld();
});

Companies.getCompanies()
.then(function (companies) {
  var companyInfo = companies.map(function (company) {
    return [company.name, company.id];
  });
  return companyInfo;
})
.then(function (companyNames) {
  return Promise.map(companyNames, function (companyName) {
    var alchemyUrl = 'https://gateway-a.watsonplatform.net/calls/data'
    var queryParam = '/GetNews?apikey=' + alchemyKey + '&outputMode=json&start=now-1y&end=now';
    queryParam += '&return=enriched.url.publicationDate.date,enriched.url.text,enriched.url.url,enriched.url.title,enriched.url.image&dedup=1&rank=high^medium&q.enriched.url.enrichedTitle.entities.entity.text=' + companyName[0];

    var alchemyCall = axios.create({
      baseURL: alchemyUrl,
      timeout: 2000
    });

    return alchemyCall.get(queryParam)
    .then(function (results) {
      if(results.data.status === 'ERROR') return new Promise.resolve([]);

      if (results.data.result.docs) {
        for(var i = 0; i < results.data.result.docs.length; i++){
          results.data.result.docs[i].id = companyName[1];
        }
        return results.data.result.docs;          
      }      
    });
  });
})
.then(function (array) {
  return _.flatten(array);
})
.then(function (data) {
  if(data.length <= 0) return '';
  data.forEach(function (val) {
    var article = val.source.enriched.url;
    var articleObj = {
      title: article.cleanedTitle,
      snippet: article.text.substr(0, 300) + '...',
      url: article.url,
      image_url: article.image,
      date_written: moment(article.publicationDate.date).format(),
      author: article.author
    };
    News.addNews(articleObj, val.id);
  });
  return '';
})
.finally(function (data) {
  console.log('<<<<<<<<<<<<<<');
  console.log('>>>>>>>> called');
  News.removeOld();
});
