var news = angular.module('jobascript.news', ['jobascript.company', 'ngSanitize']);

news.config(require('./routes.js'));

news.controller('NewsController', require('./controller.js'));
news.factory('News', require('./services.js'));

require('angular-sanitize');

module.exports = news;
