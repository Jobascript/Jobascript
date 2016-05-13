var comm = angular.module('jobascript.comm', ['jobascript.company', 'angular-google-gapi']);

comm.config(require('./routes.js'));

comm.controller('CommController', require('./controller.js'));
comm.factory('Comm', require('./services.js'));

require('angular-google-gapi');

module.exports = comm;
