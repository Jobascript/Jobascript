var comm = angular.module('jobascript.comm', ['jobascript.company']);

comm.config(require('./routes.js'));

comm.controller('CommController', require('./controller.js'));
comm.factory('Comm', require('./services.js'));
comm.factory('GAPI', require('./gapi.js'));
comm.directive('emailThread', require('./thread/threadDirective.js'));


module.exports = comm;
