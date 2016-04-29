var news = angular.module('jobascript.news', ['jobascript.company']);

news.config(require('./routes.js'));

news.controller('NewsController', require('./controller.js'));
news.factory('News', require('./services.js'));

module.exports = news;
